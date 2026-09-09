import { api } from '../api'
import { Song } from './types'
import { IPaginationResponse } from '../pagination'
import { OrderBy } from '../enums/order-by'
import { Liked } from '../enums/liked'
import { Random } from '../enums/random'
import { Source } from '../enums/source'
import { Reverse } from '../enums/reverse'
import { HardDelete } from '../enums/hardDelete'

export interface getSongsProps {
  page?: number
  limit?: number
  order_by?: OrderBy
  liked?: Liked
  text?: string
  duration_gte?: number
  duration_lte?: number
}

export async function GetSongs({
  page,
  duration_gte,
  duration_lte,
  order_by,
  liked,
  limit,
  text,
}: getSongsProps) {
  const { data } = await api.get<{
    songs: Song[]
    meta: IPaginationResponse
  }>('/song', {
    params: {
      page,
      limit,
      order_by,
      liked,
      text,
      duration_gte,
      duration_lte,
    },
  })

  return data
}

export interface AddSongProps {
  url: string
}

export async function AddSong({ url }: AddSongProps) {
  await api.post('/song/download', {
    url,
  })
}
interface updateSongProps {
  song_id: string
  liked?: Liked
  duration?: number
  artist?: string
  title?: string
}

export async function UpdateSong(props: updateSongProps) {
  await api.put('/song', {
    song_id: props.song_id,
    liked: props.liked,
    duration: props.duration,
    artist: props.artist,
    title: props.title,
  })
}

interface GetNextSongsProps {
  random?: Random
  source?: Source
  sourceId?: string
  startId?: string
  reverse?: Reverse
}

export async function GetNextSongs(props: GetNextSongsProps) {
  const { data } = await api.get<Song[]>('/song/next', {
    params: {
      random: props.random,
      source: props.source,
      source_id: props.sourceId,
      start_id: props.startId,
      reverse: props.reverse
    },
  })

  return data
}

interface DeleteSongProps {
  song_id?: string
  hard_delete?: HardDelete
}

export async function DeleteSong({ song_id, hard_delete }: DeleteSongProps) {
  const { data } = await api.delete("/song", {
    data: {
      song_id,
      hard_delete
    }
  })

  return data
}