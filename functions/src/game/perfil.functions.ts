import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { validarApelido } from './moderation';

const db = () => getFirestore();

/**
 * Período de ranking 'aaaammm' do mês atual.
 * @return {string} período.
 */
function periodoAtual(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// Define/atualiza o apelido do jogador após passar pela moderação server-side.
export const definirApelido = onCall(async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Faça login para escolher um apelido.');

  const validacao = validarApelido(req.data?.apelido as string);
  if (!validacao.ok || !validacao.apelidoLimpo) {
    throw new HttpsError('invalid-argument', validacao.motivo ?? 'Apelido inválido.');
  }
  const apelido = validacao.apelidoLimpo;

  await db().doc(`gameJogadores/${uid}`).set(
    { apelido, atualizadoEm: FieldValue.serverTimestamp() },
    { merge: true }
  );

  // Denormaliza no ranking do mês corrente, se o jogador já pontuou.
  const rankingRef = db().doc(`gameRankingMensal/${periodoAtual()}/jogadores/${uid}`);
  const rankingSnap = await rankingRef.get();
  if (rankingSnap.exists) {
    await rankingRef.set({ apelido }, { merge: true });
  }

  return { ok: true, apelido };
});
