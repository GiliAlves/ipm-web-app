import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgressoTrilha } from '../../domain/entities/game.entity';
import { IPerfilJogadorRepository } from '../../domain/ports/quiz.repository';
import { ProgressoDto } from '../dto/game.dto';
import { PERFIL_JOGADOR_REPOSITORY_TOKEN } from '../tokens';

/**
 * Caso de uso para obter o progresso do jogador em cada trilha
 * (nível atual e quanto falta de XP para o próximo).
 */
@Injectable({ providedIn: 'root' })
export class GetProgressoJogadorUseCase {
  private readonly repository = inject<IPerfilJogadorRepository>(PERFIL_JOGADOR_REPOSITORY_TOKEN);

  execute(dto: ProgressoDto): Observable<ProgressoTrilha[]> {
    return this.repository.getProgresso(dto);
  }
}
