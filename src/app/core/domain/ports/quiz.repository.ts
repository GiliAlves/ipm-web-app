import { Observable } from 'rxjs';
import {
  PerfilJogador,
  ProgressoTrilha,
  Ranking,
  ResultadoSessao,
  SessaoQuiz,
} from '../entities/game.entity';
import {
  FinalizarSessaoDto,
  IniciarSessaoDto,
  ProgressoDto,
  RankingMensalDto,
} from '../../application/dto/game.dto';

/**
 * Porta do quiz. As duas operações são atendidas por Cloud Functions
 * (o servidor guarda o gabarito e calcula a pontuação — nunca o cliente).
 */
export interface IQuizRepository {
  iniciarSessao(dto: IniciarSessaoDto): Observable<SessaoQuiz>;
  finalizarSessao(dto: FinalizarSessaoDto): Observable<ResultadoSessao>;
}

/** Porta de leitura do ranking (Firestore, coleção pública a autenticados). */
export interface IRankingRepository {
  getRankingMensal(dto: RankingMensalDto): Observable<Ranking>;
}

/** Porta de leitura do perfil/progresso do jogador (Firestore, dono lê o próprio). */
export interface IPerfilJogadorRepository {
  getPerfil(uid: string): Observable<PerfilJogador | undefined>;
  getProgresso(dto: ProgressoDto): Observable<ProgressoTrilha[]>;
}
