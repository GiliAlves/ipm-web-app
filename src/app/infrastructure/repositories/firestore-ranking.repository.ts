import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, limit, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntradaRanking, Ranking, Trilha } from '../../core/domain/entities';
import { IRankingRepository } from '../../core/domain/ports';
import { RankingMensalDto } from '../../core/application/dto/game.dto';

interface RankingDoc {
  id?: string;
  apelido?: string;
  pontos?: number;
  pontosPorTrilha?: Partial<Record<Trilha, number>>;
}

/**
 * Leitura do ranking mensal a partir de `gameRankingMensal/{periodo}/jogadores`.
 * A escrita é exclusiva das Cloud Functions.
 */
@Injectable({ providedIn: 'root' })
export class FirestoreRankingRepository implements IRankingRepository {
  private readonly base = 'gameRankingMensal';

  constructor(private readonly firestore: Firestore) {}

  getRankingMensal(dto: RankingMensalDto): Observable<Ranking> {
    const periodo = dto.periodo ?? this.periodoAtual();
    const trilha = dto.trilha ?? 'geral';
    const campoOrdenacao = trilha === 'geral' ? 'pontos' : `pontosPorTrilha.${trilha}`;

    const ref = collection(this.firestore, `${this.base}/${periodo}/jogadores`);
    return collectionData(query(ref, orderBy(campoOrdenacao, 'desc'), limit(50)), {
      idField: 'id',
    }).pipe(
      map((docs) => this.montarRanking(periodo, trilha, docs as RankingDoc[]))
    );
  }

  private montarRanking(periodo: string, trilha: Trilha | 'geral', docs: RankingDoc[]): Ranking {
    const entradas: EntradaRanking[] = docs.map((doc, indice) => ({
      uid: doc.id ?? '',
      apelido: doc.apelido ?? 'Anônimo',
      pontos: trilha === 'geral' ? doc.pontos ?? 0 : doc.pontosPorTrilha?.[trilha] ?? 0,
      posicao: indice + 1,
    }));
    return { periodo, trilha, entradas };
  }

  /** Período no formato 'aaaammm' — sem depender de fuso do servidor. */
  private periodoAtual(): string {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    return `${ano}${mes}`;
  }
}
