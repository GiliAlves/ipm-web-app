import { Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GetAllNovoCanticoUseCase } from '../../core/application/use-cases';
import { NovoCantico } from '../../core/domain/entities';

/**
 * Store signal-based para a página de Novo Cântico.
 */
@Injectable({ providedIn: 'root' })
export class UseNovoCanticoStore {
  readonly hinos$ = this.getAllNovoCanticoUseCase.execute();
  readonly hinos = toSignal(this.hinos$, { initialValue: [] as NovoCantico[] });

  readonly isOpenDetailsModal = signal(false);
  readonly isOpenPartituraPDFModal = signal(false);
  readonly isOpenColorModal = signal(false);
  readonly searchBarTerm = signal('');
  readonly partitura = signal('');
  readonly indice = signal(false);

  constructor(private readonly getAllNovoCanticoUseCase: GetAllNovoCanticoUseCase) {}

  openDetailsModal(): void {
    this.isOpenDetailsModal.set(true);
  }

  closeDetailsModal(): void {
    this.isOpenDetailsModal.set(false);
  }

  toggleDetailsModal(): void {
    this.isOpenDetailsModal.update(value => !value);
  }

  openPartituraPDFModal(partitura: string): void {
    this.partitura.set(partitura);
    this.isOpenPartituraPDFModal.set(true);
  }

  closePartituraPDFModal(): void {
    this.isOpenPartituraPDFModal.set(false);
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
