/** Trilhas do game (sociedades internas da IPB). O jogador pode competir em várias. */
export type Trilha = 'UCP' | 'UPA' | 'UMP' | 'Adultos';

/** Grandes áreas de conteúdo das perguntas. */
export type Tema = 'biblia' | 'historia' | 'confissoes';

/** Dificuldade dentro de uma trilha. */
export type Dificuldade = 'facil' | 'medio' | 'dificil';

/** Alternativa de resposta exibida ao jogador (nunca marca a correta). */
export interface Alternativa {
  id: string;
  texto: string;
}

/**
 * Pergunta como o jogador a recebe durante uma sessão: sem gabarito e com as
 * alternativas já embaralhadas pelo servidor.
 */
export interface PerguntaSessao {
  id: string;
  tema: Tema;
  dificuldade: Dificuldade;
  enunciado: string;
  alternativas: Alternativa[];
}

/** Sessão de quiz retornada por `iniciarSessao`. */
export interface SessaoQuiz {
  sessionId: string;
  trilha: Trilha;
  tempoPorPerguntaSeg: number;
  perguntas: PerguntaSessao[];
}

/** Resposta que o jogador envia ao finalizar a sessão. */
export interface RespostaJogador {
  perguntaId: string;
  alternativaId: string;
  tempoMs: number;
}

/** Correção de uma pergunta, revelada só depois do envio (material de estudo). */
export interface ResultadoPergunta {
  perguntaId: string;
  correta: boolean;
  alternativaCorretaId: string;
  explicacao: string;
  pontos: number;
}

/** Resultado consolidado de uma sessão finalizada. */
export interface ResultadoSessao {
  acertos: number;
  total: number;
  pontosGanhos: number;
  xpGanho: number;
  xpTrilha: number;
  nivelAtual: number;
  subiuNivel: boolean;
  resultados: ResultadoPergunta[];
}

/** Ofensiva de dias consecutivos jogando. */
export interface Ofensiva {
  dias: number;
  ultimoDiaJogado: string; // ISO yyyy-mm-dd
}

/** Perfil persistente do jogador. */
export interface PerfilJogador {
  uid: string;
  apelido: string;
  xpPorTrilha: Record<Trilha, number>;
  nivelPorTrilha: Record<Trilha, number>;
  ofensiva: Ofensiva;
}

/** Progresso do jogador numa trilha específica (para a barra "faltam X pts"). */
export interface ProgressoTrilha {
  trilha: Trilha;
  xp: number;
  nivel: number;
  xpNecessarioProximo: number | null; // null = nível máximo
  progresso: number; // 0..1 rumo ao próximo nível
}

/** Uma linha do ranking. */
export interface EntradaRanking {
  uid: string;
  apelido: string;
  pontos: number;
  posicao: number;
}

/** Ranking mensal, geral ou por trilha. */
export interface Ranking {
  periodo: string; // 'aaaammm'
  trilha: Trilha | 'geral';
  entradas: EntradaRanking[];
}
