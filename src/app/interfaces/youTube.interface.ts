export interface YouTube {
  etag: string,
  items: Items[],
  kind: string,
  nextPageToken: string,
  pageInfo: {
    resultsPerPage: number,
    totalResults: number
  },
  regionCode: string
}

export interface Items {
  kind: string,
  etag: string,
  id: {
      kind: string,
      videoId: string
  },
  snippet: {
      publishedAt: string,
      title: string,
      description: string,
      thumbnails: {
          default: {
              url: string,
              width: number,
              height: number
          },
          medium: {
              url: string,
              width: number,
              height: number
          },
          high: {
              url: string,
              width: number,
              height: number
          }
      },
      channelTitle: string,
      liveBroadcastContent: string,
      publishTime: string,
  }
}
