import { api } from '../api'
import { YouTubeLikedPlaylistResponse } from './types'

interface props {
  pageToken?: string
}

export async function GetMyLikedPlaylist({ pageToken }: props) {
  const { data } = await api.get<YouTubeLikedPlaylistResponse>('/youtube/playlist', {
    params: {
      page: pageToken ?? undefined,
    },
  })

  return data
}

export async function LoginYoutube() {
  const data = await api.get<{ url: string }>('/youtube/auth-url')

  return data
}
