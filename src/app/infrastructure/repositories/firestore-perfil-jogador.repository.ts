import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PerfilJogador, ProgressoTrilha, Trilha } from '../../core/domain/entities';
import { IPerfilJogadorRepository } from '../../core/domain/ports';
import { ProgressoDto } from '../../core/application/dto/game.dto';

const TRILHAS: Trilha[] = ['UCP', 'UPA', 'UMP', 'Adultos'];

/** Um patamar de nível, lido de `gameNiveis/{trilha}`. */
interface NivelConfig {
  nivel: number;
  xpNecessario: number;
}

/**
 * Leitura do perfil e do progresso do jogador. Perfil vem de
 * `gameJogadores/{uid}` (o dono lê o próprio); os patamares de nível de
 * `gameNiveis/{trilha}`. Escrita é exclusiva das Cloud Functions.
 */
@Injectable({ providedIn: 'root' })
export class FirestorePerfilJogadorRepository implements IPerfilJogadorRepository {
  constructor(private readonly firestore: Firestore) {}

  getPerfil(uid: string): Observable<PerfilJogador | undefined> {
    return docData(doc(this.firestore, `gameJogadores/${uid}`), { idField: 'uid' }) as Observable<
      PerfilJogador | undefined
    >;
  }

  getProgresso(dto: ProgressoDto): Observable<ProgressoTrilha[]> {
    return combineLatest([this.getPerfil(dto.uid), this.getNiveis()]).pipe(
      map(([perfil, niveis]) =>
        TRILHAS.map((trilha) =>
          this.calcularProgresso(trilha, perfil?.xpPorTrilha?.[trilha] ?? 0, niveis[trilha] ?? [])
        )
      )
    );
  }

  private getNiveis(): Observable<Record<Trilha, NivelConfig[]>> {
    const ref = collection(this.firestore, 'gameNiveis');
    return collectionData(ref, { idField: 'id' }).pipe(
      map((docs) => {
        const mapa = {} as Record<Trilha, NivelConfig[]>;
        for (const d of docs as Array<{ id: string; niveis?: NivelConfig[] }>) {
          mapa[d.id as Trilha] = (d.niveis ?? []).slice().sort((a, b) => a.xpNecessario - b.xpNecessario);
        }
        return mapa;
      })
    );
  }

  private calcularProgresso(trilha: Trilha, xp: number, niveis: NivelConfig[]): ProgressoTrilha {
    if (niveis.length === 0) {
      return { trilha, xp, nivel: 1, xpNecessarioProximo: null, progresso: 0 };
    }
    let atual = niveis[0];
    let proximo: NivelConfig | null = null;
    for (let i = 0; i < niveis.length; i++) {
      if (xp >= niveis[i].xpNecessario) {
        atual = niveis[i];
        proximo = niveis[i + 1] ?? null;
      }
    }
    const progresso = proximo
      ? (xp - atual.xpNecessario) / (proximo.xpNecessario - atual.xpNecessario)
      : 1;
    return {
      trilha,
      xp,
      nivel: atual.nivel,
      xpNecessarioProximo: proximo?.xpNecessario ?? null,
      progresso: Math.max(0, Math.min(1, progresso)),
    };
  }
}
