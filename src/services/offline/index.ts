import { offlineDB } from "@/lib/offlineDb"
import { Song } from "@/services/songs/types"
import { getSongsProps } from "../songs"
import { OrderBy } from "../enums/order-by"
import { IPaginationResponse } from "../pagination"

const baseUrl = process.env.NEXT_PUBLIC_API_URL
const token = process.env.NEXT_PUBLIC_TOKEN

export async function DownloadSongOffline(song: Song) {
    if (!song.local_url) return

    const response = await fetch(
        baseUrl + song.local_url + "?token=" + token
    )

    if (!response.ok) {
        throw new Error("Failed to download song")
    }

    let image: Blob | undefined

    const audio = await response.blob()

    if (song.img_url) {
        try {
            const imageResponse = await fetch(song.img_url)

            if (imageResponse?.ok) {
                image = await imageResponse.blob()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const offlineSong = {
        id: song.id,
        audio,
        artist: song.artist ?? "failed to get artist",
        title: song.title ?? "failed to get title",
        duration: song.duration ?? 0,
        img_url: song.img_url,
        local_url: song.local_url,
        image,
        downloadedAt: Date.now(),
    }

    await offlineDB.songs.put(offlineSong)

    return offlineSong
}

export async function GetOfflineSong(songId: string) {
    return await offlineDB.songs.get(songId)
}

export async function GetOfflineSongs({
    page = 1,
    limit = 20,
    order_by,
    liked,
    text,
}: getSongsProps) {
    let songs = await offlineDB.songs.toArray()

    const totalSongs = songs.length

    if (text) {
        const search = text.toLowerCase()

        songs = songs.filter(song =>
            song.title.toLowerCase().includes(search) ||
            song.artist.toLowerCase().includes(search)
        )
    }

    // Pagination
    const start = (page - 1) * limit
    const paginatedSongs = songs.slice(start, start + limit)

    const total = songs.length

    return {
        songs: paginatedSongs,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            items: songs.length,
            totalItems: totalSongs
        } as IPaginationResponse,
    }
}

export async function DeleteOfflineSong({song_id}: {
    song_id: string
}) {

}

export async function GetTotalSize() {
    const songs = await offlineDB.songs.toArray()

    const audioStorage = songs.reduce(
        (total, song) => total + (song.audio?.size ?? 0),
        0
    )

    return audioStorage
}

export async function getCount() {
    const songs = await offlineDB.songs.toArray()

    return songs.length
}