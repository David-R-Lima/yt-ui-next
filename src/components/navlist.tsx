'use client'

import { Home, ListEnd, Menu } from "lucide-react";
import { AddPlaylistDialog } from "./add-playlist-dialog";
import { useRouter } from "next/navigation";

export function NavList({show}: {show: boolean}) {
    const router = useRouter()
    return (
        <div className="h-screen">
            <div className="flex flex-col space-y-2">
                <div className="flex space-x-2 hover:cursor-pointer hover:bg-gray-800 p-2 rounded-lg" onClick={() => {
                    router.push("/")
                }}>
                    <Home className="text-primary hover:cursor-pointer"></Home>
                    {show && (
                        <p>Home</p>
                    )}
                </div>
                <div className="flex space-x-2 hover:cursor-pointer hover:bg-gray-800 p-2 rounded-lg" onClick={() => {
                    router.push("/playlist")
                }}>
                    <ListEnd className="text-primary hover:cursor-pointer"/>
                    {show && (
                        <p>Playlists</p>
                    )}
                </div>
                <div className="flex space-x-2">
                    <AddPlaylistDialog text={show ? "Add playlist" : undefined}></AddPlaylistDialog>
                </div>
            </div>
        </div>
    )
}