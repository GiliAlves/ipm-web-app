import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IJogadorRepository, RespostaApelido } from '../../domain/ports/jogador.repository';
import { JOGADOR_REPOSITORY_TOKEN } from '../tokens';

/**
 * Caso de uso para definir o apelido do jogador. A moderação (nomes impróprios)
 * acontece no servidor; aqui só encaminhamos e propagamos o erro.
 */
@Injectable({ providedIn: 'root' })
export class DefinirApelidoUseCase {
  private readonly repository = inject<IJogadorRepository>(JOGADOR_REPOSITORY_TOKEN);

  execute(apelido: string): Observable<RespostaApelido> {
    return this.repository.definirApelido(apelido);
  }
}
