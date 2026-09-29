'use client'

import { DisplayDownloaded } from "@/components/playlist/display-downloaded-songs"


export default function Page() {

    return (
        <div>
            <h1 className="p-8 text-xl text-primary">Downloaded Songs</h1>
            <DisplayDownloaded></DisplayDownloaded>
        </div>  
    )
}