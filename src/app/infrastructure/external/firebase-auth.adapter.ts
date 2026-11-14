import { Injectable } from '@angular/core';
import { Auth, authState, signInAnonymously } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IAuthService } from '../../core/domain/ports';

/**
 * Adapter de autenticação com Firebase Auth. Usa sessão anônima como padrão do
 * game — sem fricção de cadastro — mantendo um uid estável por dispositivo.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseAuthAdapter implements IAuthService {
  readonly uid$: Observable<string | null> = authState(this.auth).pipe(map((u) => u?.uid ?? null));

  constructor(private readonly auth: Auth) {}

  garantirSessao(): Observable<string> {
    // authStateReady() resolve só depois de restaurar a sessão persistida,
    // evitando criar um novo anônimo (e perder progresso) por causa da corrida.
    return from(this.auth.authStateReady()).pipe(
      switchMap(() => {
        const atual = this.auth.currentUser;
        if (atual) return from(Promise.resolve(atual.uid));
        return from(signInAnonymously(this.auth)).pipe(map((cred) => cred.user.uid));
      })
    );
  }
}
