import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable, filter } from 'rxjs';
import { BOLETIM_REPOSITORY_TOKEN } from '../core/application/tokens';
import { Boletim } from '../core/domain/entities';
import { IBoletimRepository } from '../core/domain/ports/boletim.repository';

/**
 * Resolver que carrega um boletim específico do repositório antes de ativar a rota.
 */
export const boletimResolver: ResolveFn<Boletim> = (
  route: ActivatedRouteSnapshot
): Observable<Boletim> => {
  const repository = inject<IBoletimRepository>(BOLETIM_REPOSITORY_TOKEN);
  const id = route.paramMap.get('id') ?? '';
  return repository.getById(id).pipe(
    filter((boletim): boletim is Boletim => boletim !== undefined)
  );
};