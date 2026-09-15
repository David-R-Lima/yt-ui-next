"use client"

import { ArrowDown, ArrowUp, AudioLines, Loader2, Plus } from "lucide-react"
import { usePlaylists } from "@/hooks/usePlaylists"
import { notFound, useRouter } from "next/navigation"
import { useState } from "react"
import { AddPlaylistDialog } from "@/components/add-playlist-dialog"

export default function Playlist() {
    const playlistQuery = usePlaylists()
    const router = useRouter()
    const [displayCustomPlaylist, setDisplayCustomPlaylist] = useState<boolean>(false)

    if (playlistQuery.isLoading) {
        return <Loader2 className="animate-spin w-full h-full"></Loader2>
    }

    if(playlistQuery.isError) {
        return notFound()
    }

    return (
        <div className="flex w-full h-full">
            <div className="flex flex-col p-4 w-full">
                <div className="flex items-center space-x-2 hover:cursor-pointer hover:bg-secondary rounded-lg p-2 w-full" onClick={() => {
                        router.push("/home/playlist/" + "all")
                    }}>
                        <div>
                            <AudioLines className="text-primary size-10 object-cover"></AudioLines>
                        </div>
                        <div>
                            <h1 className="">All</h1>
                            <div className="italic text-[12px] flex items-center space-x-2">
                                <h2 className="">420 songs</h2>
                                <p>|</p>
                                <h2>All songs available</h2>
                            </div>
                        </div>
                </div>
                <div className="flex items-center space-x-2 hover:cursor-pointer hover:bg-secondary rounded-lg p-2 w-full" onClick={() => {
                        router.push("/home/playlist/" + "liked")
                    }}>
                        <div>
                            <AudioLines className="text-primary size-10 object-cover"></AudioLines>
                        </div>
                        <div>
                            <h1 className="">Liked</h1>
                            <div className="italic text-[12px] flex items-center space-x-2">
                                <h2 className="">420 songs</h2>
                                <p>|</p>
                                <h2>All liked songs</h2>
                            </div>
                        </div>
                </div>
                <div className="flex items-center space-x-2 hover:cursor-pointer hover:bg-secondary rounded-lg p-2 w-full" onClick={() => {
                        router.push("/home/playlist/" + "history")
                    }}>
                        <div>
                            <AudioLines className="text-primary size-10 object-cover"></AudioLines>
                        </div>
                        <div>
                            <h1 className="">History</h1>
                            <div className="italic text-[12px] flex items-center space-x-2">
                                <h2 className="">420 songs</h2>
                                <p>|</p>
                                <h2>Previously heard songs</h2>
                            </div>
                        </div>
                </div>
                <div className="flex items-center space-x-4 m-2 py-2 border-t-2 border-b-2 border-gray-800">
                    <p>Custom playlists</p>
                    <div className="flex items-center space-x-2">
                        {displayCustomPlaylist ? (
                            <p onClick={() => {
                                setDisplayCustomPlaylist(false)
                            }} className="text-primary hover:cursor-pointer hover:bg-gray-800 p-2 rounded-lg"><ArrowUp></ArrowUp></p>
                        ) : (
                            <p onClick={() => {
                                setDisplayCustomPlaylist(true)
                            }} className="text-primary hover:cursor-pointer hover:bg-gray-800 p-2 rounded-lg"><ArrowDown></ArrowDown></p>
                        )}
                        <AddPlaylistDialog text={""}></AddPlaylistDialog>
                    </div>
                </div>
                {displayCustomPlaylist && playlistQuery.data?.playlists.map((playlist) => {
                    return (
                        <div className="flex items-center space-x-2 hover:cursor-pointer hover:bg-secondary rounded-lg p-2 w-full" key={playlist.id} onClick={() => {
                            router.push("/home/playlist/" + playlist.id)
                        }}>
                            <div>
                                {playlist.img_url ? (
                                    <img className="size-10 object-cover" src={playlist.img_url} alt="" />
                                ) : (
                                    <AudioLines className="text-primary size-10 object-cover"></AudioLines>
                                )}
                            </div>
                            <div>
                                <h1 className="">{playlist?.name ?? "placeholder"}</h1>
                                <div className="italic text-[12px] flex items-center space-x-2">
                                    <h2 className="">{playlist.playlist_songs?.length ?? 420} songs</h2>
                                    <p>|</p>
                                    <h2>{playlist.description}</h2>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}