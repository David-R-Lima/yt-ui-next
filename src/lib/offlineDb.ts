import Dexie, { type Table } from "dexie"

export interface OfflineSong {
  id: string
  title: string
  artist: string
  img_url: string | undefined
  duration: number
  audio: Blob
  image: Blob | undefined
  local_url: string | undefined
  downloadedAt: number
  smartDownloaded?: boolean
}

class OfflineDatabase extends Dexie {
  songs!: Table<OfflineSong, string>

  constructor() {
    super("music-app")

    this.version(1).stores({
      songs: "id, downloadedAt",
    })
  }
}

export const offlineDB = new OfflineDatabase()