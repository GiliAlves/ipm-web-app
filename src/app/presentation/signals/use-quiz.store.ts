import { Injectable, computed, inject, signal } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import {
  FinalizarQuizUseCase,
  IniciarQuizUseCase,
} from '../../core/application/use-cases';
import {
  RespostaJogador,
  ResultadoSessao,
  SessaoQuiz,
  Tema,
  Trilha,
} from '../../core/domain/entities';
import { IAuthService } from '../../core/domain/ports';
import { AUTH_SERVICE_TOKEN } from '../../core/application/tokens';

/**
 * Store da sessão de quiz: controla o fluxo jogar → responder → finalizar.
 * A pontuação e o gabarito ficam no servidor; aqui só orquestramos o estado.
 */
@Injectable({ providedIn: 'root' })
export class UseQuizStore {
  private readonly auth = inject<IAuthService>(AUTH_SERVICE_TOKEN);
  private readonly iniciarUseCase = inject(IniciarQuizUseCase);
  private readonly finalizarUseCase = inject(FinalizarQuizUseCase);

  readonly sessao = signal<SessaoQuiz | null>(null);
  readonly indice = signal(0);
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);
  readonly resultado = signal<ResultadoSessao | null>(null);

  private respostas: RespostaJogador[] = [];
  private inicioPerguntaMs = 0;

  readonly perguntaAtual = computed(() => {
    const s = this.sessao();
    return s ? s.perguntas[this.indice()] ?? null : null;
  });
  readonly total = computed(() => this.sessao()?.perguntas.length ?? 0);
  readonly numeroAtual = computed(() => Math.min(this.indice() + 1, this.total()));

  iniciar(trilha: Trilha, temas?: Tema[]): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.resultado.set(null);
    this.sessao.set(null);
    this.indice.set(0);
    this.respostas = [];

    this.auth
      .garantirSessao()
      .pipe(switchMap(() => this.iniciarUseCase.execute({ trilha, temas })))
      .subscribe({
        next: (sessao) => {
          this.sessao.set(sessao);
          this.inicioPerguntaMs = Date.now();
          this.carregando.set(false);
        },
        error: (e) => {
          this.erro.set(e?.message ?? 'Não foi possível iniciar o quiz.');
          this.carregando.set(false);
        },
      });
  }

  /** Registra a resposta da pergunta atual e avança (ou finaliza no fim). */
  responder(alternativaId: string): void {
    const pergunta = this.perguntaAtual();
    if (!pergunta || this.carregando()) return;

    this.respostas.push({
      perguntaId: pergunta.id,
      alternativaId,
      tempoMs: Date.now() - this.inicioPerguntaMs,
    });

    if (this.indice() < this.total() - 1) {
      this.indice.update((i) => i + 1);
      this.inicioPerguntaMs = Date.now();
    } else {
      this.finalizar();
    }
  }

  private finalizar(): void {
    const s = this.sessao();
    if (!s) return;
    this.carregando.set(true);
    this.finalizarUseCase.execute({ sessionId: s.sessionId, respostas: this.respostas }).subscribe({
      next: (resultado) => {
        this.resultado.set(resultado);
        this.carregando.set(false);
      },
      error: (e) => {
        this.erro.set(e?.message ?? 'Não foi possível finalizar o quiz.');
        this.carregando.set(false);
      },
    });
  }
}
