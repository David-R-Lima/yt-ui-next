"use client"

import UseControls from "@/store/song-control-store"
import { useEffect } from "react"

export function PlayerTitle() {
    const {currentSong, isPlaying} = UseControls()

    useEffect(() => {
        if(isPlaying) {
            document.title = currentSong?.title
                ? `${currentSong.title} - ${currentSong.artist}`
                : "Player"
        }

        return () => {
            document.title = "Player"
        }
    }, [currentSong?.title, isPlaying])

    return null
}