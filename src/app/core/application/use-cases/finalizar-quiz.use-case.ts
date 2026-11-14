import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultadoSessao } from '../../domain/entities/game.entity';
import { IQuizRepository } from '../../domain/ports/quiz.repository';
import { FinalizarSessaoDto } from '../dto/game.dto';
import { QUIZ_REPOSITORY_TOKEN } from '../tokens';

/**
 * Caso de uso para finalizar a sessão: envia as respostas, o servidor corrige,
 * pontua, atualiza XP/nível/ranking e revela o gabarito para estudo.
 */
@Injectable({ providedIn: 'root' })
export class FinalizarQuizUseCase {
  private readonly repository = inject<IQuizRepository>(QUIZ_REPOSITORY_TOKEN);

  execute(dto: FinalizarSessaoDto): Observable<ResultadoSessao> {
    return this.repository.finalizarSessao(dto);
  }
}
