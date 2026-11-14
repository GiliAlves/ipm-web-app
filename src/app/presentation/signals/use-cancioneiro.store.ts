import { Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GetAllCanticoUseCase } from '../../core/application/use-cases';
import { Cantico } from '../../core/domain/entities';

/**
 * Store signal-based para a página do Cancioneiro.
 */
@Injectable({ providedIn: 'root' })
export class UseCancioneiroStore {
  readonly canticos$ = this.getAllCanticoUseCase.execute();
  readonly canticos = toSignal(this.canticos$, { initialValue: [] as Cantico[] });

  readonly isOpenDetailsModal = signal(false);
  readonly isOpenColorModal = signal(false);
  readonly searchBarTerm = signal('');
  readonly indice = signal(false);

  constructor(private readonly getAllCanticoUseCase: GetAllCanticoUseCase) {}

  toggleDetailsModal(): void {
    this.isOpenDetailsModal.update(value => !value);
  }

  openColorModal(): void {
    this.isOpenColorModal.set(true);
  }

  closeColorModal(): void {
    this.isOpenColorModal.set(false);
  }

  toggleColorModal(): void {
    this.isOpenColorModal.update(value => !value);
  }

  updateSearchBarTerm(term: string): void {
    this.searchBarTerm.set(term);
  }

  toggleIndice(): void {
    this.indice.update(value => !value);
  }
}
