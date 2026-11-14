import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PerfilJogador } from '../../domain/entities/game.entity';
import { IPerfilJogadorRepository } from '../../domain/ports/quiz.repository';
import { PERFIL_JOGADOR_REPOSITORY_TOKEN } from '../tokens';

/**
 * Caso de uso para obter o perfil do jogador (apelido, ofensiva, XP por trilha).
 */
@Injectable({ providedIn: 'root' })
export class GetPerfilJogadorUseCase {
  private readonly repository = inject<IPerfilJogadorRepository>(PERFIL_JOGADOR_REPOSITORY_TOKEN);

  execute(uid: string): Observable<PerfilJogador | undefined> {
    return this.repository.getPerfil(uid);
  }
}
