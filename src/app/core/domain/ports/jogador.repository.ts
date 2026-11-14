import { Observable } from 'rxjs';

/** Resposta da moderação de apelido. */
export interface RespostaApelido {
  ok: boolean;
  apelido: string;
}

/**
 * Porta de comandos do jogador (escrita). Vai por Cloud Functions porque o
 * apelido passa por moderação server-side antes de gravar o perfil.
 */
export interface IJogadorRepository {
  definirApelido(apelido: string): Observable<RespostaApelido>;
}
