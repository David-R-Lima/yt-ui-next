import UseControls from "@/store/song-control-store";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import React, { Dispatch } from "react";
import { Playlist } from "@/services/playlist/types";

interface Props {
    setDisplayPlaylist: Dispatch<React.SetStateAction<Playlist | undefined>>
    displayPlaylist: Playlist
}

export function SongsList({setDisplayPlaylist, displayPlaylist}: Props) {
    const {setCurrentSong} = UseControls()

    return (
        <div className="flex flex-col items-start justify-start w-full h-[65vh] bg-primary-foreground p-4 mt-10">
            <div>
                <Button onClick={() => {
                    setDisplayPlaylist(undefined)
                }}>
                    <ChevronLeft/>
                </Button>
            </div>
            <div className="mt-8 overflow-y-scroll w-full px-8">
                <ul className="space-y-2 w-full">
                {displayPlaylist.playlist_songs && displayPlaylist.playlist_songs.length > 0 ? (
                    displayPlaylist.playlist_songs.map((data) => {
                    if (!data || !data.song) return null

                    return (
                        <li key={data.song_id} className="flex w-full space-x-4 border-b rounded-lg p-2 m-2 hover:cursor-pointer hover:bg-secondary" onClick={() => {
                            if(data.song) {
                                setCurrentSong(data.song)
                            }
                        }}>
                            <p>{data.song.title ?? 'Untitled'}</p>
                            {
                                data.song.duration && (
                                    <p>
                                        {Math.floor(data.song.duration / 60)}:
                                        {(data.song.duration % 60).toString().padStart(2, '0')}
                                    </p>
                                )
                            }
                            <p>{data.song.local_url ? (
                                "downloaded"
                            ) : (
                                "not downloaded"
                            )}</p>
                        </li>
                    )
                    })
                ) : (
                    <li className="text-gray-500">No songs found in this playlist.</li>
                )}
                </ul>
            </div>
        </div>
    )
}