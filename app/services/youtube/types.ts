export interface YouTubeLikedPlaylistResponse {
  kind: string
  etag: string
  nextPageToken?: string
  prevPageToken?: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: YouTubeLikedPlayistItem[]
}

export interface YouTubeLikedPlayistItem {
  kind: string
  etag: string
  id: string
  downloaded: boolean
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default?: YouTubeThumbnail
      medium?: YouTubeThumbnail
      high?: YouTubeThumbnail
    }
    channelTitle: string
    liveBroadcastContent: 'none' | 'live' | 'upcoming'
    publishTime: string
    playlistId: string
    position: number
    resourceId: {
      kind: string
      videoId: string
    }
  }
}

export interface YouTubeThumbnail {
  url: string
  width: number
  height: number
}
