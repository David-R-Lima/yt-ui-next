import { offlineDB } from "@/lib/offlineDb"
import { Song } from "@/services/songs/types"
import { GetSongById, getSongsProps } from "../songs"
import { IPaginationResponse } from "../pagination"
import { GetSmartDownloads } from "../history"

const baseUrl = process.env.NEXT_PUBLIC_API_URL
const token = process.env.NEXT_PUBLIC_TOKEN

export async function DownloadSongOffline(song: Song, smartDownloaded?: boolean) {
    if (!song.local_url) return

    const response = await fetch(
        baseUrl + song.local_url + "?token=" + token
    )

    if (!response.ok) {
        throw new Error("Failed to download song")
    }

    let image: Blob | undefined

    const audio = await response.blob()

    // if (song.img_url) {
    //     try {
    //         const imageResponse = await fetch(song.img_url)

    //         if (imageResponse?.ok) {
    //             image = await imageResponse.blob()
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

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
        smartDownloaded
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
    await offlineDB.songs.delete(song_id)
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

export async function getAllIds() {
    const localSongs = await offlineDB.songs.toArray()

    return localSongs
        .filter(song => song.id && song.smartDownloaded)
        .map(song => song.id)
}

export async function SmartDownload(limit: number) {
    const songs = await getAllIds()
    const songsToDownload = await GetSmartDownloads(limit)

    const songsToAdd = songsToDownload.songIds.filter(
        id => !songs.includes(id)
    )

    const songsToRemove = songs.filter(
        id => !songsToDownload.songIds.includes(id)
    )

    const delay = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms))

    for (let i = 0; i < songsToAdd.length; i++) {
        const id = songsToAdd[i]

        console.log("downloading song:", id)

        const { song } = await GetSongById(id)

        if (song) {
            await DownloadSongOffline(song)
        }

        if (i < songsToAdd.length - 1) {
            await delay(2000)
        }
    }

    for (const id of songsToRemove) {
        await DeleteOfflineSong({song_id: id})
    }
}