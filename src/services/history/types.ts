import { Song } from "../songs/types"

export interface History {
    id: string
    song_id: string
    created_at?: Date
    updated_at?: Date
    song?: Song
}