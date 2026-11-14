import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Ranking } from '../../domain/entities/game.entity';
import { IRankingRepository } from '../../domain/ports/quiz.repository';
import { RankingMensalDto } from '../dto/game.dto';
import { RANKING_REPOSITORY_TOKEN } from '../tokens';

/**
 * Caso de uso para obter o ranking mensal (geral ou por trilha).
 */
@Injectable({ providedIn: 'root' })
export class GetRankingMensalUseCase {
  private readonly repository = inject<IRankingRepository>(RANKING_REPOSITORY_TOKEN);

  execute(dto: RankingMensalDto = {}): Observable<Ranking> {
    return this.repository.getRankingMensal(dto);
  }
}
