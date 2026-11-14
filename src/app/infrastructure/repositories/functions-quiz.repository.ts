import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResultadoSessao, SessaoQuiz } from '../../core/domain/entities';
import { IQuizRepository } from '../../core/domain/ports';
import { FinalizarSessaoDto, IniciarSessaoDto } from '../../core/application/dto/game.dto';

/**
 * Adapter do quiz via Cloud Functions. O gabarito e a pontuação vivem no
 * servidor — este repositório só encaminha as chamadas callable.
 */
@Injectable({ providedIn: 'root' })
export class FunctionsQuizRepository implements IQuizRepository {
  constructor(private readonly functions: Functions) {}

  iniciarSessao(dto: IniciarSessaoDto): Observable<SessaoQuiz> {
    const callable = httpsCallable<IniciarSessaoDto, SessaoQuiz>(this.functions, 'iniciarSessao');
    return from(callable(dto)).pipe(map((res) => res.data));
  }

  finalizarSessao(dto: FinalizarSessaoDto): Observable<ResultadoSessao> {
    const callable = httpsCallable<FinalizarSessaoDto, ResultadoSessao>(this.functions, 'finalizarSessao');
    return from(callable(dto)).pipe(map((res) => res.data));
  }
}
