import { Playlist } from '../playlist/types'
import { Song } from '../songs/types'

export interface PlaylistSong {
  song_id: string
  playlist_id: string
  song?: Song
  playlist?: Playlist
}
