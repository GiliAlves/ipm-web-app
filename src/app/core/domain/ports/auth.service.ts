import { Observable } from 'rxjs';

/**
 * Porta de autenticação. O game usa sessão anônima por padrão (apelido genérico)
 * e depois pode ser elevada a uma conta real sem perder o progresso.
 */
export interface IAuthService {
  /** Emite o uid atual, ou null quando não há sessão. */
  readonly uid$: Observable<string | null>;

  /** Garante uma sessão (anônima se necessário) e resolve com o uid. */
  garantirSessao(): Observable<string>;
}
