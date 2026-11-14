# Arquitetura do Game Bíblico — modelagem de dados, Functions e segurança

Este documento fecha a modelagem do módulo de game (quiz) sobre a arquitetura
limpa já existente no app. As convenções seguem o restante do projeto:
entidades = `interface` (nomes de domínio em português), ports `I*Repository`
retornando `Observable`, use-cases `@Injectable` com `execute()`, tokens
`*_REPOSITORY_TOKEN`, impls `Firebase*`/`Functions*` ligadas por `useExisting`
em `repository.providers.ts`.

---

## 0. Pré-requisito: autenticação (decisão necessária)

O app **hoje não tem Firebase Auth** (`login`/`cadastro` são telas sem lógica).
Um game com ranking por pessoa e anti-cheat server-side **precisa** de uma
identidade confiável (`request.auth.uid`), porque:

- as Cloud Functions só conseguem atribuir pontos ao jogador certo via `context.auth`;
- as regras do Firestore usam `request.auth.uid` para proteger o perfil e o gabarito.

**Recomendação (MVP):** ativar **Firebase Auth Anônimo** (`@angular/fire/auth`,
`signInAnonymously`) — cria um `uid` estável por dispositivo, sem fricção de
cadastro. Depois dá para "elevar" a conta anônima para e-mail/senha ou provedor
social reaproveitando a tela de `cadastro`, sem perder o progresso (`linkWithCredential`).

> Sem auth, dá para fazer um **Modo Treino offline** (não pontua ranking), mas o
> **Modo Ranqueado** fica inviável de proteger. O restante deste doc assume um `uid`.

---

## 1. Coleções do Firestore

| Coleção | Conteúdo | Quem lê | Quem escreve |
|---------|----------|---------|--------------|
| `gamePerguntas/{id}` | Pergunta **com** gabarito e `explicacao` + campo `sorteio` (número aleatório) | ninguém (só Admin SDK) | só Admin SDK / publicador |
| `gameNiveis/{trilha}` | Config de níveis: `[{ nivel, xpNecessario, temas[] }]` | todos | admin |
| `gameJogadores/{uid}` | Perfil: apelido, `xpPorTrilha`, `nivelPorTrilha`, `streak` | o dono | só Functions |
| `gameRankingMensal/{aaaammm}/jogadores/{uid}` | `pontos`, `pontosPorTrilha`, `apelido` (denormalizado) | autenticados | só Functions |
| `gameSessoes/{uid}/sessoes/{sessionId}` | Auditoria: perguntas sorteadas, ordem embaralhada, gabarito, respostas, status | ninguém/dono | só Functions |

**Por que o gabarito nunca vai pro cliente:** o app **não lê `gamePerguntas`**.
Quem serve as perguntas é a Function `iniciarSessao`, que devolve as alternativas
**sem** `respostaCorretaId` e **embaralhadas por sessão**. O gabarito só é revelado
por `finalizarSessao`, depois que a resposta já foi enviada (aí vira material de estudo).

### Publicação (seed → Firestore)
O `questions.seed.json` (status `aprovado`) é publicado em `gamePerguntas` por um
script admin, que a cada doc **adiciona `sorteio = Math.random()`** (usado para
sorteio eficiente) e mantém `respostaCorretaId`/`explicacao` (protegidos pelas regras).

---

## 2. Contrato das Cloud Functions (callable)

Chamadas do app via `@angular/fire/functions` (`httpsCallable`). Ambas exigem
`context.auth` (rejeitam com `unauthenticated` se não houver `uid`).

### `iniciarSessao`
```
entrada : { trilha: Trilha, temas?: Tema[], quantidade?: number }
saída   : {
  sessionId: string,
  trilha: Trilha,
  tempoPorPerguntaSeg: number,
  perguntas: [{ id, tema, dificuldade, enunciado,
                alternativas: [{ id, texto }] }]   // SEM respostaCorretaId, ordem embaralhada
}
```
Passos: valida auth → sorteia N perguntas `ativo && status=='aprovado' &&
trilhas array-contains trilha` (via campo `sorteio`, ver §4) → embaralha a ordem
das alternativas com um seed da sessão → grava `gameSessoes/{uid}/sessoes/{sessionId}`
com o gabarito e a ordem → devolve as perguntas sem gabarito.

### `finalizarSessao`
```
entrada : { sessionId: string,
            respostas: [{ perguntaId, alternativaId, tempoMs }] }
saída   : {
  acertos, total, pontosGanhos, xpGanho, xpTrilha, nivelAtual, subiuNivel,
  resultados: [{ perguntaId, correta, alternativaCorretaId, explicacao, pontos }]
}
```
Passos: carrega a sessão (dona == uid, não finalizada, dentro da validade) →
para cada resposta compara com o gabarito guardado → calcula pontos (§3) →
numa transação, incrementa `xpPorTrilha`/atualiza `nivelPorTrilha`, atualiza
`streak`, soma no `gameRankingMensal` do mês → marca a sessão como finalizada
(idempotente: rechamar devolve o mesmo resultado, não pontua de novo) → revela
gabarito + `explicacao` para estudo.

---

## 3. Pontuação (fonte única, no servidor)

```
tempoPorPerguntaSeg = 20
PONTOS_BASE         = 10
MULT_DIFICULDADE    = { facil: 1.0, medio: 1.5, dificil: 2.0 }
BONUS_VELOCIDADE_MAX= 5     // proporcional ao tempo restante
BONUS_COMBO_ACERTO  = 2     // por acerto consecutivo, com teto
BONUS_COMBO_TETO    = 10

por pergunta, se acertou:
  pontos = round( PONTOS_BASE * MULT_DIFICULDADE[dif]
                 + BONUS_VELOCIDADE_MAX * (tempoRestante / tempoTotal)
                 + min(comboAtual * BONUS_COMBO_ACERTO, BONUS_COMBO_TETO) )
  comboAtual++
se errou:
  pontos = 0
  comboAtual = 0    // erro nunca tira pontos, só quebra o combo
```

**Duas moedas:**
- **XP** (`xpPorTrilha`) só sobe → desbloqueia níveis. Ranking separado por trilha.
- **Pontos do mês** (`gameRankingMensal`) zeram todo mês → alimentam o painel de
  metas mensais estilo "anéis de treino".

**Níveis:** `gameNiveis/{trilha}` define `xpNecessario` acumulado por nível. O
`nivelPorTrilha` do jogador é o maior nível cujo `xpNecessario <= xpPorTrilha`.
Progresso pro próximo = `(xp - limiarAtual) / (limiarProximo - limiarAtual)`.

---

## 4. Sorteio eficiente e anti-repetição

Firestore não sorteia nativamente. Cada pergunta tem `sorteio: number` (aleatório
0–1 na publicação). Para pegar N aleatórias:
1. gera `pivot = random()`;
2. `where(sorteio >= pivot) orderBy(sorteio) limit N`;
3. se vier menos que N (fim da faixa), completa com `where(sorteio < pivot) orderBy(sorteio)`.

Anti-repetição leve (opcional): a Function pode receber/gravar os últimos IDs
jogados no perfil e refiltrar. Anti-cheat de verdade vem do **pool grande**
(meta 300–500) + **ordem de alternativas embaralhada por sessão** + **timer**.

---

## 5. Regras de segurança (resumo — arquivo em `firestore.rules`)

- `gamePerguntas`, `gameSessoes`: `read/write` negados ao cliente (só Admin SDK das Functions).
- `gameJogadores/{uid}`: `read` se `request.auth.uid == uid`; `write` negado (só Functions).
- `gameRankingMensal/**`: `read` se autenticado; `write` negado.
- `gameNiveis`: `read` público; `write` negado.

Como o Admin SDK (Functions) **ignora** as regras, todo o mutation acontece lá —
o cliente nunca escreve pontuação nem lê gabarito.

---

## 6. Mapa de arquivos (o que criar no app)

```
core/domain/entities/game.entity.ts        → Trilha, Tema, SessaoQuiz, ResultadoSessao,
                                              PerfilJogador, ProgressoTrilha, Ranking...
core/domain/ports/quiz.repository.ts        → IQuizRepository, IRankingRepository,
                                              IPerfilJogadorRepository
core/application/dto/game.dto.ts            → IniciarSessaoDto, FinalizarSessaoDto,
                                              RankingMensalDto, ProgressoDto
core/application/tokens/index.ts (+3 linhas)→ QUIZ_/RANKING_/PERFIL_JOGADOR_REPOSITORY_TOKEN
core/application/use-cases/                 → iniciar-quiz, finalizar-quiz,
                                              get-ranking-mensal, get-progresso-jogador
infrastructure/repositories/                → functions-quiz.repository.ts (callables),
                                              firestore-ranking.repository.ts,
                                              firestore-perfil-jogador.repository.ts
infrastructure/config/repository.providers  → +3 linhas useExisting
presentation/signals/                       → use-quiz.store.ts, use-painel.store.ts
presentation/pages/game/                     → painel, jogar, resultado, ranking

functions/                                   → backend (iniciarSessao, finalizarSessao, scoring)
firestore.rules                              → regras acima
```
