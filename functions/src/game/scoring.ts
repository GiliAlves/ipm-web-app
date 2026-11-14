/**
 * Fonte ÚNICA de pontuação do game — roda só no servidor.
 * O cliente nunca calcula pontos; apenas envia a alternativa escolhida e o tempo.
 */

export type Dificuldade = 'facil' | 'medio' | 'dificil';

export const TEMPO_POR_PERGUNTA_SEG = 20;
export const PONTOS_BASE = 10;
export const BONUS_VELOCIDADE_MAX = 5;
export const BONUS_COMBO_ACERTO = 2;
export const BONUS_COMBO_TETO = 10;

const MULT_DIFICULDADE: Record<Dificuldade, number> = {
  facil: 1.0,
  medio: 1.5,
  dificil: 2.0,
};

export interface EntradaPontuacao {
  acertou: boolean;
  dificuldade: Dificuldade;
  tempoMs: number;
  /** combo acumulado ANTES desta pergunta */
  comboAtual: number;
}

export interface SaidaPontuacao {
  pontos: number;
  novoCombo: number;
}

/**
 * Pontua uma pergunta. Erro nunca subtrai; apenas zera o combo.
 * @param {EntradaPontuacao} e dados da resposta (acerto, dificuldade, tempo, combo).
 * @return {SaidaPontuacao} pontos ganhos e o novo valor de combo.
 */
export function pontuarPergunta(e: EntradaPontuacao): SaidaPontuacao {
  if (!e.acertou) {
    return { pontos: 0, novoCombo: 0 };
  }
  const tempoTotalMs = TEMPO_POR_PERGUNTA_SEG * 1000;
  const tempoRestante = Math.max(0, tempoTotalMs - Math.max(0, e.tempoMs));
  const fracaoTempo = tempoTotalMs > 0 ? tempoRestante / tempoTotalMs : 0;

  const bonusVelocidade = BONUS_VELOCIDADE_MAX * fracaoTempo;
  const bonusCombo = Math.min(e.comboAtual * BONUS_COMBO_ACERTO, BONUS_COMBO_TETO);
  const bruto = PONTOS_BASE * MULT_DIFICULDADE[e.dificuldade] + bonusVelocidade + bonusCombo;

  return { pontos: Math.round(bruto), novoCombo: e.comboAtual + 1 };
}

/**
 * Embaralha um array (Fisher–Yates) com PRNG determinístico por seed da sessão.
 * @param {T[]} itens array a embaralhar (não é mutado).
 * @param {number} seed semente do PRNG (xorshift32).
 * @return {T[]} novo array embaralhado.
 */
export function embaralharComSeed<T>(itens: T[], seed: number): T[] {
  const arr = itens.slice();
  let estado = seed >>> 0 || 1;
  const rand = () => {
    // xorshift32
    estado ^= estado << 13;
    estado ^= estado >>> 17;
    estado ^= estado << 5;
    return ((estado >>> 0) % 100000) / 100000;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Maior nível cujo xpNecessario <= xp (patamares já ordenados asc).
 * @param {number} xp XP acumulado na trilha.
 * @param {Array<{nivel: number, xpNecessario: number}>} niveis patamares de nível.
 * @return {number} número do nível atual.
 */
export function nivelParaXp(xp: number, niveis: Array<{ nivel: number; xpNecessario: number }>): number {
  let nivel = niveis.length ? niveis[0].nivel : 1;
  for (const p of niveis) {
    if (xp >= p.xpNecessario) nivel = p.nivel;
  }
  return nivel;
}
