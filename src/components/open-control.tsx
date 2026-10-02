'use client'

import { formatTime } from "@/lib/formatTime"
import { DownloadSongOffline, GetOfflineSong } from "@/services/offline"
import UseControls from "@/store/song-control-store"
import { AudioLines, Check, Download, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { UpdateSong } from "@/services/songs"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Liked } from "@/services/enums/liked"

export function OpenControls() {
    const { currentSong, playlist, setCurrentSongFromNext } = UseControls()
    const [isDownloaded, setIsDownloaded] = useState(false)

    useEffect(() => {
        async function checkOfflineSong() {
            if(currentSong) {
                const song = await GetOfflineSong(currentSong.id)

                setIsDownloaded(!!song)
            }
        }

        checkOfflineSong()
    }, [currentSong])

    const updateSongMutation = useMutation({
        mutationFn: UpdateSong,
        onSuccess: () => {
            toast.success("Liked song")
        },
        onError: () => {
            toast.error("Something went wrong!")
        }
    })

    return (
        <div className="flex flex-col md:grid md:grid-cols-[minmax(0,1fr)_50%] lg:grid-cols-[minmax(0,1fr)_35%] w-full h-full">
            <div className="flex flex gap-4 items-center justify-center min-w-0 p-2">
                {currentSong?.img_url ? (
                    <img
                        className="size-36 md:size-48 lg:size-86 object-cover rounded"
                        src={currentSong.img_url}
                        alt={currentSong.title || "Song image"}
                    />
                ) : (
                    <AudioLines className="w-16 h-16 text-primary" />
                )}
                <div className="flex flex-col items-center gap-4">
                    {isDownloaded ? (
                        <Button disabled>
                            <Check />
                            {/* <p className="hidden lg:block">Downloaded</p> */}
                        </Button>
                    ) : (
                        <Button onClick={() => {
                            if(currentSong) {
                                DownloadSongOffline(currentSong)

                                setIsDownloaded(true)
                            }
                        }}>
                            <Download />
                            {/* <p className="hidden lg:block">Download</p> */}
                        </Button>
                    )}
                    {
                        currentSong && currentSong?.liked ? (
                            <Heart className="fill-primary text-primary transition-colors hover:animate-pulse hover:cursor-pointer" onClick={() => {
                                updateSongMutation.mutate({
                                    song_id: currentSong.id,
                                    liked: Liked.FALSE
                                })
    
                                currentSong.liked = false
                            }}/>
                        ) : (
                            <Heart className="transition-colors hover:animate-pulse hover:cursor-pointer" onClick={() => {
                                if(currentSong) {
                                    updateSongMutation.mutate({
                                        song_id: currentSong.id,
                                        liked: Liked.TRUE
                                    })
        
                                    currentSong.liked = true
                                }
                            }}/>
                        )
                    }
                </div>
            </div>

            <div className="w-full max-h-full overflow-x-hidden overflow-y-auto p-4">
                {playlist.map((song, i) => (
                    <div
                        className="w-full flex justify-between items-center gap-4 mb-4 hover:cursor-pointer"
                        key={i}
                        onClick={() => {
                            setCurrentSongFromNext(i)
                        }}
                    >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                            {song?.img_url ? (
                                <img
                                    className="size-12 object-cover rounded shrink-0"
                                    src={song.img_url}
                                    alt={song.title || "Song image"}
                                />
                            ) : (
                                <AudioLines className="w-12 h-12 text-primary shrink-0" />
                            )}
                            
                            <div className="flex-1 min-w-0">
                                {currentSong?.id === song.id ? (
                                    <p className="truncate font-medium animate-pulse text-primary">
                                        {song.title}
                                    </p>
                                ) : (
                                    <p className="truncate font-medium text-white">
                                        {song.title}
                                    </p>
                                )}

                                <p className="truncate text-sm text-muted-foreground">
                                    {song.artist}
                                </p>
                            </div>
                        </div>

                        <div className="text-sm text-muted-foreground shrink-0 ml-2">
                            {formatTime(song?.duration)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}