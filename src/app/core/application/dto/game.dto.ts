import { RespostaJogador, Tema, Trilha } from '../../domain/entities/game.entity';

/** Parâmetros para iniciar uma sessão de quiz. */
export interface IniciarSessaoDto {
  trilha: Trilha;
  temas?: Tema[];
  quantidade?: number;
}

/** Envio das respostas para finalizar e pontuar a sessão. */
export interface FinalizarSessaoDto {
  sessionId: string;
  respostas: RespostaJogador[];
}

/** Consulta ao ranking mensal. `periodo` no formato 'aaaammm' (default: mês atual). */
export interface RankingMensalDto {
  periodo?: string;
  trilha?: Trilha | 'geral';
}

/** Consulta ao progresso de um jogador. */
export interface ProgressoDto {
  uid: string;
}
