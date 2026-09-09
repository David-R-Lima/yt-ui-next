
export interface Song {
  id: string
  title?: string
  artist?: string
  duration?: number
  liked?: boolean
  img_url?: string
  youtube_url?: string
  local_url?: string
  created_at?: Date
  updated_at?: Date
}
