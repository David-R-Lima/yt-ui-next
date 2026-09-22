'use client'

import { formatTime } from "@/lib/formatTime"
import UseControls from "@/store/song-control-store"
import { AudioLines } from "lucide-react"

export function OpenControls() {
    const { currentSong, playlist, setCurrentSong } = UseControls()
    return (
        <div className="flex flex-col md:grid md:grid-cols-[minmax(0,1fr)_50%] lg:grid-cols-[minmax(0,1fr)_35%] w-full h-full">
            <div className="flex items-center justify-center min-w-0 p-4">
                {currentSong?.img_url ? (
                    <img
                        className="size-36 md:size-48 lg:size-86 object-cover rounded"
                        src={currentSong.img_url}
                        alt={currentSong.title || "Song image"}
                    />
                ) : (
                    <AudioLines className="w-16 h-16 text-primary" />
                )}
            </div>

            <div className="w-full max-h-full overflow-x-hidden overflow-y-auto p-8">
                {playlist.map((song, i) => (
                    <div
                        className="w-full flex justify-between items-center gap-4 mb-4 hover:cursor-pointer"
                        key={i}
                        onClick={() => {
                            setCurrentSong(song)
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
                                <p className="truncate font-medium text-white">
                                    {song.title}
                                </p>
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