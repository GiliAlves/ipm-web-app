import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, combineLatest } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import {
  DefinirApelidoUseCase,
  GetPerfilJogadorUseCase,
  GetProgressoJogadorUseCase,
  GetRankingMensalUseCase,
} from '../../core/application/use-cases';
import { PerfilJogador, ProgressoTrilha, Ranking, Trilha } from '../../core/domain/entities';
import { IAuthService } from '../../core/domain/ports';
import { RespostaApelido } from '../../core/domain/ports/jogador.repository';
import { AUTH_SERVICE_TOKEN } from '../../core/application/tokens';

const RANKING_INICIAL: Ranking = { periodo: '', trilha: 'geral', entradas: [] };

/**
 * Store do painel do game: perfil/ofensiva, progresso por trilha e ranking
 * mensal (com trilha selecionável). O uid vem da sessão (anônima por padrão).
 */
@Injectable({ providedIn: 'root' })
export class UsePainelStore {
  private readonly auth = inject<IAuthService>(AUTH_SERVICE_TOKEN);
  private readonly getPerfil = inject(GetPerfilJogadorUseCase);
  private readonly getProgresso = inject(GetProgressoJogadorUseCase);
  private readonly getRanking = inject(GetRankingMensalUseCase);
  private readonly definirApelido = inject(DefinirApelidoUseCase);

  /** Trilha exibida no ranking; 'geral' soma todas. */
  readonly trilhaRanking = signal<Trilha | 'geral'>('geral');

  /** Disparador para recarregar o perfil após uma escrita (ex.: apelido). */
  private readonly recarregarPerfil = signal(0);

  private readonly uid$ = this.auth.garantirSessao().pipe(shareReplay(1));

  readonly uid = toSignal(this.uid$, { initialValue: '' });

  readonly perfil = toSignal<PerfilJogador | undefined>(
    combineLatest([this.uid$, toObservable(this.recarregarPerfil)]).pipe(
      switchMap(([uid]) => this.getPerfil.execute(uid))
    )
  );

  readonly progresso = toSignal(
    this.uid$.pipe(switchMap((uid) => this.getProgresso.execute({ uid }))),
    { initialValue: [] as ProgressoTrilha[] }
  );

  readonly ranking = toSignal(
    toObservable(this.trilhaRanking).pipe(
      switchMap((trilha) => this.getRanking.execute({ trilha }))
    ),
    { initialValue: RANKING_INICIAL }
  );

  readonly apelido = computed(() => this.perfil()?.apelido ?? 'Visitante');
  readonly ofensiva = computed(() => this.perfil()?.ofensiva?.dias ?? 0);

  selecionarTrilhaRanking(trilha: Trilha | 'geral'): void {
    this.trilhaRanking.set(trilha);
  }

  /**
   * Envia o apelido para moderação server-side. Em caso de sucesso, recarrega
   * o perfil para refletir o novo nome. O erro é propagado para a UI.
   */
  salvarApelido(apelido: string): Observable<RespostaApelido> {
    return this.definirApelido.execute(apelido).pipe(
      tap((resposta) => {
        if (resposta.ok) {
          this.recarregarPerfil.update((n) => n + 1);
        }
      })
    );
  }
}
