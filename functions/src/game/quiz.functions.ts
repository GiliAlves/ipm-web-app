import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import {
  Dificuldade,
  TEMPO_POR_PERGUNTA_SEG,
  embaralharComSeed,
  nivelParaXp,
  pontuarPergunta,
} from './scoring';

// admin.initializeApp() é chamado uma única vez em ../index.ts.
// Pegamos o Firestore de forma lazy (dentro dos handlers) porque os imports ES
// são avaliados antes do corpo do index.ts rodar o initializeApp.
const db = () => getFirestore();

type Trilha = 'UCP' | 'UPA' | 'UMP' | 'Adultos';
const QUANTIDADE_PADRAO = 10;
const VALIDADE_SESSAO_MS = 60 * 60 * 1000; // 1h

interface PerguntaBanco {
  id: string;
  tema: string;
  dificuldade: Dificuldade;
  enunciado: string;
  alternativas: Array<{ id: string; texto: string }>;
  respostaCorretaId: string;
  explicacao: string;
}

interface RespostaJogador {
  perguntaId: string;
  alternativaId: string;
  tempoMs: number;
}

/** Pergunta como guardada na sessão (com gabarito, só no servidor). */
interface PerguntaSessao {
  perguntaId: string;
  tema: string;
  dificuldade: Dificuldade;
  enunciado: string;
  alternativas: Array<{ id: string; texto: string }>;
  respostaCorretaId: string;
  explicacao: string;
}

/** Documento de sessão em gameSessoes/{uid}/sessoes/{id}. */
interface SessaoDoc {
  uid: string;
  trilha: Trilha;
  status: 'aberta' | 'finalizada';
  criadaEm?: { toMillis?: () => number };
  perguntas: PerguntaSessao[];
  resultado?: unknown;
}

/** Patamar de nível em gameNiveis/{trilha}. */
interface NivelConfig {
  nivel: number;
  xpNecessario: number;
}

// ----------------------------------------------------------------- iniciarSessao
export const iniciarSessao = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Faça login para jogar.');

  const trilha = req.data?.trilha as Trilha;
  if (!trilha) throw new HttpsError('invalid-argument', 'Trilha obrigatória.');
  const temas = (req.data?.temas as string[] | undefined) ?? null;
  const quantidade = Math.min(Math.max(Number(req.data?.quantidade) || QUANTIDADE_PADRAO, 1), 20);

  const perguntas = await sortearPerguntas(trilha, temas, quantidade);
  if (perguntas.length === 0) {
    throw new HttpsError('failed-precondition', 'Sem perguntas aprovadas para esta trilha.');
  }

  const sessaoRef = db().collection(`gameSessoes/${uid}/sessoes`).doc();
  const seedBase = Math.floor(Math.random() * 2 ** 31);

  // Guarda o gabarito + a ordem embaralhada no servidor.
  const perguntasSessao = perguntas.map((p, i) => ({
    perguntaId: p.id,
    tema: p.tema,
    dificuldade: p.dificuldade,
    enunciado: p.enunciado,
    alternativas: embaralharComSeed(p.alternativas, seedBase + i), // [{id,texto}] embaralhado
    respostaCorretaId: p.respostaCorretaId,
    explicacao: p.explicacao,
  }));

  await sessaoRef.set({
    uid,
    trilha,
    status: 'aberta',
    criadaEm: FieldValue.serverTimestamp(),
    perguntas: perguntasSessao,
  });

  // Devolve ao cliente SEM gabarito e SEM explicação.
  return {
    sessionId: sessaoRef.id,
    trilha,
    tempoPorPerguntaSeg: TEMPO_POR_PERGUNTA_SEG,
    perguntas: perguntasSessao.map((p) => ({
      id: p.perguntaId,
      tema: p.tema,
      dificuldade: p.dificuldade,
      enunciado: p.enunciado,
      alternativas: p.alternativas,
    })),
  };
});

/**
 * Sorteia perguntas aprovadas e ativas de uma trilha usando o campo `sorteio`.
 * @param {Trilha} trilha trilha alvo.
 * @param {string[] | null} temas filtro opcional de temas.
 * @param {number} quantidade número de perguntas desejado.
 * @return {Promise<PerguntaBanco[]>} perguntas sorteadas (com gabarito).
 */
async function sortearPerguntas(
  trilha: Trilha,
  temas: string[] | null,
  quantidade: number
): Promise<PerguntaBanco[]> {
  const col = db().collection('gamePerguntas');
  const pivot = Math.random();

  const buscar = async (op: '>=' | '<') => {
    const q = col
      .where('ativo', '==', true)
      .where('status', '==', 'aprovado')
      .where('trilhas', 'array-contains', trilha)
      .where('sorteio', op, pivot)
      .orderBy('sorteio', op === '>=' ? 'asc' : 'desc')
      .limit(quantidade * 3); // folga para filtrar tema em memória
    const snap = await q.get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PerguntaBanco, 'id'>) }));
  };

  let candidatas = await buscar('>=');
  if (candidatas.length < quantidade) {
    candidatas = candidatas.concat(await buscar('<'));
  }
  if (temas && temas.length) {
    candidatas = candidatas.filter((p) => temas.includes(p.tema));
  }
  return candidatas.slice(0, quantidade);
}

// --------------------------------------------------------------- finalizarSessao
export const finalizarSessao = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Faça login para jogar.');

  const sessionId = req.data?.sessionId as string;
  const respostas = (req.data?.respostas as RespostaJogador[]) ?? [];
  if (!sessionId) throw new HttpsError('invalid-argument', 'sessionId obrigatório.');

  const sessaoRef = db().doc(`gameSessoes/${uid}/sessoes/${sessionId}`);
  const snap = await sessaoRef.get();
  if (!snap.exists) throw new HttpsError('not-found', 'Sessão inexistente.');
  const sessao = snap.data() as SessaoDoc;

  if (sessao.uid !== uid) throw new HttpsError('permission-denied', 'Sessão de outro jogador.');
  if (sessao.status === 'finalizada') return sessao.resultado; // idempotente
  const criadaMs = sessao.criadaEm?.toMillis?.() ?? 0;
  if (criadaMs && Date.now() - criadaMs > VALIDADE_SESSAO_MS) {
    throw new HttpsError('deadline-exceeded', 'Sessão expirada.');
  }

  const trilha = sessao.trilha as Trilha;
  const respostaPorId = new Map(respostas.map((r) => [r.perguntaId, r]));

  // Corrige e pontua no servidor.
  let combo = 0;
  let pontosGanhos = 0;
  let acertos = 0;
  const resultadosPergunta = sessao.perguntas.map((p: PerguntaSessao) => {
    const r = respostaPorId.get(p.perguntaId);
    const acertou = !!r && r.alternativaId === p.respostaCorretaId;
    const { pontos, novoCombo } = pontuarPergunta({
      acertou,
      dificuldade: p.dificuldade,
      tempoMs: r?.tempoMs ?? TEMPO_POR_PERGUNTA_SEG * 1000,
      comboAtual: combo,
    });
    combo = novoCombo;
    pontosGanhos += pontos;
    if (acertou) acertos++;
    return {
      perguntaId: p.perguntaId,
      correta: acertou,
      alternativaCorretaId: p.respostaCorretaId,
      explicacao: p.explicacao,
      pontos,
    };
  });

  const xpGanho = pontosGanhos; // XP = pontos da partida (só acumula)
  const periodo = periodoAtual();

  // Patamares de nível da trilha.
  const niveisSnap = await db().doc(`gameNiveis/${trilha}`).get();
  const niveis = ((niveisSnap.data()?.niveis as NivelConfig[]) ?? [])
    .slice()
    .sort((a, b) => a.xpNecessario - b.xpNecessario);

  // Atualiza perfil (XP/nível/ofensiva) numa transação.
  const perfilRef = db().doc(`gameJogadores/${uid}`);
  const { xpTrilha, nivelAtual, subiuNivel, apelido } = await db().runTransaction(async (tx) => {
    const pSnap = await tx.get(perfilRef);
    const perfil = pSnap.data() ?? {};
    const xpAntes = perfil.xpPorTrilha?.[trilha] ?? 0;
    const nivelAntes = perfil.nivelPorTrilha?.[trilha] ?? nivelParaXp(xpAntes, niveis);
    const xpDepois = xpAntes + xpGanho;
    const nivelDepois = nivelParaXp(xpDepois, niveis);
    const nome = perfil.apelido ?? 'Anônimo';

    tx.set(
      perfilRef,
      {
        apelido: nome,
        xpPorTrilha: { ...(perfil.xpPorTrilha ?? {}), [trilha]: xpDepois },
        nivelPorTrilha: { ...(perfil.nivelPorTrilha ?? {}), [trilha]: nivelDepois },
        ofensiva: calcularOfensiva(perfil.ofensiva),
        atualizadoEm: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return { xpTrilha: xpDepois, nivelAtual: nivelDepois, subiuNivel: nivelDepois > nivelAntes, apelido: nome };
  });

  // Soma no ranking mensal (pontos do mês zeram por período).
  await db().doc(`gameRankingMensal/${periodo}/jogadores/${uid}`).set(
    {
      apelido,
      pontos: FieldValue.increment(pontosGanhos),
      pontosPorTrilha: { [trilha]: FieldValue.increment(pontosGanhos) },
      atualizadoEm: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  const resultado = {
    acertos,
    total: sessao.perguntas.length,
    pontosGanhos,
    xpGanho,
    xpTrilha,
    nivelAtual,
    subiuNivel,
    resultados: resultadosPergunta,
  };

  await sessaoRef.set(
    { status: 'finalizada', resultado, finalizadaEm: FieldValue.serverTimestamp() },
    { merge: true }
  );
  return resultado;
});

/**
 * Período de ranking no formato 'aaaammm' referente ao mês atual.
 * @return {string} período (ex.: '202607').
 */
function periodoAtual(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Atualiza a ofensiva (dias consecutivos) considerando o último dia jogado.
 * @param {{dias: number, ultimoDiaJogado: string}} [atual] ofensiva anterior.
 * @return {{dias: number, ultimoDiaJogado: string}} ofensiva atualizada.
 */
function calcularOfensiva(atual?: { dias: number; ultimoDiaJogado: string }): {
  dias: number;
  ultimoDiaJogado: string;
} {
  const hoje = new Date().toISOString().slice(0, 10);
  if (!atual) return { dias: 1, ultimoDiaJogado: hoje };
  if (atual.ultimoDiaJogado === hoje) return atual; // já jogou hoje
  const ontem = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const dias = atual.ultimoDiaJogado === ontem ? atual.dias + 1 : 1;
  return { dias, ultimoDiaJogado: hoje };
}
