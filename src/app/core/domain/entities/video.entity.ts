/**
 * Entidade de domínio que representa um vídeo retornado pela API do YouTube.
 */
export interface Video {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  channelTitle: string;
  thumbnailUrl: string;
  liveBroadcastContent: string;
}
