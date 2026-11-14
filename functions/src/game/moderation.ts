/**
 * Moderação de apelidos do game. Roda SÓ no servidor (o cliente não escreve o
 * perfil), então é o ponto confiável para barrar nomes impróprios.
 */

export const APELIDO_MIN = 3;
export const APELIDO_MAX = 20;

// Raízes ofensivas (pt-BR) verificadas por substring no texto normalizado.
// Lista intencionalmente enxuta; ampliar conforme necessidade da moderação.
const BLOCKLIST: string[] = [
  'merd', 'bost', 'caralh', 'porra', 'buceta', 'boceta', 'viado',
  'puta', 'puto', 'fdp', 'foder', 'fodase', 'cacete',
  'piroca', 'xoxota', 'xereca', 'corno', 'arrombad',
  'desgraca', 'vagabund', 'otari', 'babaca', 'idiota', 'imbecil', 'racist',
  'nazi', 'hitler', 'porno',
];

// Palavras curtas que só valem como termo inteiro (evita falso-positivo em
// nomes legítimos que por acaso contenham essas letras).
const BLOCK_TERMO_INTEIRO = new Set(['cu', 'rola', 'pinto', 'puta', 'puto', 'sexo', 'satan']);

const SUBSTITUICOES: Record<string, string> = {
  '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's',
};

/**
 * Normaliza para detecção: minúsculas, sem acento, com leetspeak básico
 * revertido e sem caracteres não alfabéticos.
 * @param {string} texto entrada crua.
 * @return {string} texto normalizado (só letras a-z).
 */
export function normalizar(texto: string): string {
  const semLeet = (texto ?? '')
    .toLowerCase()
    .replace(/[013457@$]/g, (c) => SUBSTITUICOES[c] ?? c);
  return semLeet
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '');
}

export interface ResultadoValidacao {
  ok: boolean;
  motivo?: string;
  apelidoLimpo?: string;
}

/**
 * Valida um apelido: tamanho, caracteres permitidos e blocklist.
 * @param {string} bruto apelido informado pelo usuário.
 * @return {ResultadoValidacao} ok/motivo e o apelido já aparado.
 */
export function validarApelido(bruto: string): ResultadoValidacao {
  const apelido = (bruto ?? '').trim().replace(/\s+/g, ' ');

  if (apelido.length < APELIDO_MIN) {
    return { ok: false, motivo: `O apelido precisa de ao menos ${APELIDO_MIN} caracteres.` };
  }
  if (apelido.length > APELIDO_MAX) {
    return { ok: false, motivo: `O apelido pode ter no máximo ${APELIDO_MAX} caracteres.` };
  }
  if (!/^[A-Za-zÀ-ÿ0-9 _.]+$/.test(apelido)) {
    return { ok: false, motivo: 'Use apenas letras, números, espaço, ponto ou underscore.' };
  }

  const normalizado = normalizar(apelido);
  const palavras = apelido
    .toLowerCase()
    .split(/[^a-zÀ-ÿ]+/)
    .map((p) => normalizar(p))
    .filter(Boolean);

  for (const termo of BLOCK_TERMO_INTEIRO) {
    if (palavras.includes(termo)) {
      return { ok: false, motivo: 'Esse apelido não é permitido.' };
    }
  }
  for (const termo of BLOCKLIST) {
    if (BLOCK_TERMO_INTEIRO.has(termo)) continue;
    if (normalizado.includes(termo)) {
      return { ok: false, motivo: 'Esse apelido não é permitido.' };
    }
  }

  return { ok: true, apelidoLimpo: apelido };
}
