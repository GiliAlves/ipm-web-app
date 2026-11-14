import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonNote,
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { finalize } from 'rxjs/operators';
import { Trilha } from '../../core/domain/entities';
import { UsePainelStore } from '../../presentation/signals/use-painel.store';

/**
 * Painel do game bíblico: ofensiva, progresso por trilha e ranking mensal.
 */
@Component({
  selector: 'app-game-painel',
  templateUrl: './painel.page.html',
  styleUrls: ['./painel.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonBadge,
    IonButton,
    IonIcon,
    IonInput,
    IonModal,
    IonSpinner,
    IonText,
    IonProgressBar,
    IonSegment,
    IonSegmentButton,
  ],
})
export class GamePainelPage {
  private readonly router = inject(Router);
  private readonly store = inject(UsePainelStore);

  readonly trilhas: Trilha[] = ['UCP', 'UPA', 'UMP', 'Adultos'];

  readonly apelido = this.store.apelido;
  readonly ofensiva = this.store.ofensiva;
  readonly progresso = this.store.progresso;
  readonly ranking = this.store.ranking;
  readonly trilhaRanking = this.store.trilhaRanking;

  /** Estado do modal de apelido. */
  readonly modalAberto = signal(false);
  readonly apelidoInput = signal('');
  readonly salvando = signal(false);
  readonly erroApelido = signal<string | null>(null);

  jogar(trilha: Trilha): void {
    this.router.navigate(['/game/jogar', trilha]);
  }

  onSegment(event: CustomEvent): void {
    this.store.selecionarTrilhaRanking(event.detail.value as Trilha | 'geral');
  }

  abrirModalApelido(): void {
    const atual = this.apelido();
    this.apelidoInput.set(atual === 'Visitante' ? '' : atual);
    this.erroApelido.set(null);
    this.modalAberto.set(true);
  }

  fecharModalApelido(): void {
    if (this.salvando()) return;
    this.modalAberto.set(false);
  }

  salvarApelido(): void {
    const apelido = this.apelidoInput().trim();
    if (apelido.length < 3) {
      this.erroApelido.set('O apelido precisa ter ao menos 3 caracteres.');
      return;
    }

    this.salvando.set(true);
    this.erroApelido.set(null);
    this.store
      .salvarApelido(apelido)
      .pipe(finalize(() => this.salvando.set(false)))
      .subscribe({
        next: () => this.modalAberto.set(false),
        error: (err: { message?: string }) =>
          this.erroApelido.set(err?.message ?? 'Não foi possível salvar o apelido. Tente novamente.'),
      });
  }
}
