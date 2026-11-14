import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonNote,
  IonProgressBar,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Trilha } from '../../core/domain/entities';
import { UseQuizStore } from '../../presentation/signals/use-quiz.store';

const LETRAS = ['A', 'B', 'C', 'D', 'E'];

/**
 * Tela de jogo: apresenta as perguntas com timer e, ao final, o resultado.
 */
@Component({
  selector: 'app-game-jogar',
  templateUrl: './jogar.page.html',
  styleUrls: ['./jogar.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonText,
    IonNote,
    IonProgressBar,
    IonSpinner,
  ],
})
export class GameJogarPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly store = inject(UseQuizStore);

  readonly tempo = signal(0);
  private duracao = 20;
  private ultimoIndice = -1;
  private intervalo: ReturnType<typeof setInterval> | null = null;

  readonly letras = LETRAS;
  readonly fracaoTempo = computed(() => (this.duracao ? this.tempo() / this.duracao : 0));

  ngOnInit(): void {
    const trilha = (this.route.snapshot.paramMap.get('trilha') as Trilha) ?? 'Adultos';
    this.store.iniciar(trilha);
    this.intervalo = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) clearInterval(this.intervalo);
  }

  private tick(): void {
    if (this.store.resultado() || this.store.carregando() || !this.store.perguntaAtual()) return;

    const idx = this.store.indice();
    if (idx !== this.ultimoIndice) {
      this.ultimoIndice = idx;
      this.duracao = this.store.sessao()?.tempoPorPerguntaSeg ?? 20;
      this.tempo.set(this.duracao);
      return;
    }

    const restante = this.tempo() - 1;
    if (restante <= 0) {
      this.tempo.set(0);
      this.store.responder('__timeout__'); // sem resposta = erro, quebra o combo
    } else {
      this.tempo.set(restante);
    }
  }

  responder(alternativaId: string): void {
    this.store.responder(alternativaId);
  }

  voltarPainel(): void {
    this.router.navigate(['/game']);
  }
}
