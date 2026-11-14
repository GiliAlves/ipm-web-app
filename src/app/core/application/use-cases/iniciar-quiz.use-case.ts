import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SessaoQuiz } from '../../domain/entities/game.entity';
import { IQuizRepository } from '../../domain/ports/quiz.repository';
import { IniciarSessaoDto } from '../dto/game.dto';
import { QUIZ_REPOSITORY_TOKEN } from '../tokens';

/**
 * Caso de uso para iniciar uma sessão de quiz. O servidor sorteia as perguntas,
 * embaralha as alternativas e devolve tudo sem o gabarito.
 */
@Injectable({ providedIn: 'root' })
export class IniciarQuizUseCase {
  private readonly repository = inject<IQuizRepository>(QUIZ_REPOSITORY_TOKEN);

  execute(dto: IniciarSessaoDto): Observable<SessaoQuiz> {
    return this.repository.iniciarSessao(dto);
  }
}
