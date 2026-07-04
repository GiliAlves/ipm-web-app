import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BOLETIM_REPOSITORY_TOKEN } from '../tokens';
import { IBoletimRepository } from '../../domain/ports';
import { Boletim } from '../../domain/entities';
import { BoletimDetailDto } from '../dto';

/**
 * Caso de uso para obter o detalhe de um boletim.
 */
@Injectable({ providedIn: 'root' })
export class GetBoletimDetailUseCase {
  constructor(
    @Inject(BOLETIM_REPOSITORY_TOKEN) private readonly repository: IBoletimRepository,
  ) {}

  execute({ id }: BoletimDetailDto): Observable<Boletim | undefined> {
    return this.repository.getById(id);
  }
}
