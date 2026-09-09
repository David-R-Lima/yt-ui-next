import { PlaylistSong } from '../playlist-songs/types'
import { z } from 'zod'
export interface Playlist {
  id: string
  name?: string
  description?: string
  img_url?: string
  playlist_songs?: PlaylistSong[]
  created_at?: Date
  updated_at?: Date
}

export const CreatePlaylistSchema = z.object({
  name: z.string(),
  description: z.string().optional()
})

export type CreatePlaylistType = z.infer<typeof CreatePlaylistSchema>