import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { IJogadorRepository, RespostaApelido } from '../../core/domain/ports';

/**
 * Comandos do jogador via Cloud Functions. O apelido passa por moderação
 * server-side (`definirApelido`) antes de ser gravado.
 */
@Injectable({ providedIn: 'root' })
export class FunctionsJogadorRepository implements IJogadorRepository {
  constructor(private readonly functions: Functions) {}

  definirApelido(apelido: string): Observable<RespostaApelido> {
    const callable = httpsCallable<{ apelido: string }, RespostaApelido>(this.functions, 'definirApelido');
    return from(callable({ apelido })).pipe(map((res) => res.data));
  }
}
