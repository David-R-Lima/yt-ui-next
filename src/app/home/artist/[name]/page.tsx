'use client'

import { DisplayArtist } from "@/components/artist/display-artist-songs";
import { GetSongs } from "@/services/songs";
import UseControls from "@/store/song-control-store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";


export default function Page() {
    const params = useParams<{ name: string }>();
    const artist = decodeURIComponent(params.name);

    return (
        <div>
            <h1 className="p-8 text-xl text-primary">{artist}</h1>
            <DisplayArtist artist={artist}></DisplayArtist>
        </div>
    )
}