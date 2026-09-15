'use client'

import { DisplayAllSongs } from "@/components/playlist/all-songs";
import { DisplayPlaylist } from "@/components/playlist/display-playlist";
import { DisplayLikedSongs } from "@/components/playlist/liked-songs";
import { DisplayHistorySongs } from "@/components/playlist/previous-songs";
import { usePlaylists } from "@/hooks/usePlaylists";
import { Loader2 } from "lucide-react";
import { notFound, useParams } from "next/navigation";

export default function Playlist() {
    const params = useParams<{ id: string }>();
    const id = params.id

    const playlistQuery = usePlaylists()

    if (playlistQuery.isLoading) {
        return <Loader2 className="animate-spin w-full h-full"></Loader2>
    }

    if(id === "all") {
        return <DisplayAllSongs></DisplayAllSongs>
    }

    if(id === "liked") {
        return <DisplayLikedSongs></DisplayLikedSongs>
    }

    if(id === "history") {
        return <DisplayHistorySongs></DisplayHistorySongs>
    }

    const playlist = playlistQuery.data?.playlists.find(
        (p) => p.id === id
    );

    if (!playlist) {
        notFound();
    }

    return <DisplayPlaylist playlistId={playlist.id} />;
}