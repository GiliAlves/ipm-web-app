import { Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GetHomeDataUseCase } from '../../core/application/use-cases';

/**
 * Store signal-based para a página inicial.
 * Consolida pastorais, devocionais, calendário e vídeos.
 */
@Injectable({ providedIn: 'root' })
export class UseHomeStore {
  private readonly homeData$ = this.getHomeDataUseCase.execute();

  readonly homeData = toSignal(this.homeData$, { initialValue: { pastorais: [], devocionais: [], calendario: [], videos: [] } });
  readonly searchBarTerm = signal('');
  readonly isSpinner = signal(false);
  readonly isSubmmit = signal(false);
  readonly scrollTop = signal(true);

  constructor(private readonly getHomeDataUseCase: GetHomeDataUseCase) {}

  updateSearchBarTerm(term: string): void {
    this.searchBarTerm.set(term);
  }

  setSpinner(value: boolean): void {
    this.isSpinner.set(value);
  }

  setSubmmit(value: boolean): void {
    this.isSubmmit.set(value);
  }

  handleScroll(scrollTop: boolean): void {
    this.scrollTop.set(scrollTop);
  }
}
