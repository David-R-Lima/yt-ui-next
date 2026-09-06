'use client'

import { useEffect } from "react";
import { socket } from "@/socket";
import UseControls from "@/store/song-control-store";

export function HandleEvents() {
    const { nextSong, previousSong, play, pause } = UseControls();

    useEffect(() => {
        // Register listeners
        socket.on("play", play);
        socket.on("pause", pause);
        socket.on("skip", nextSong);
        socket.on("previous", previousSong);

        // Cleanup on unmount or re-render
        return () => {
            socket.off("play", play);
            socket.off("pause", pause);
            socket.off("skip", nextSong);
            socket.off("previous", previousSong);
        };
    }, [play, pause, nextSong, previousSong]);

    return null;
}
