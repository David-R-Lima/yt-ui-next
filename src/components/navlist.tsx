'use client'

import { Home, ListEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export function NavList({show, setSheetState, setOpenControls}: {show: boolean, setSheetState: Dispatch<SetStateAction<boolean>> | undefined, setOpenControls: Dispatch<SetStateAction<boolean>>} ) {
    const router = useRouter()
    return (
        <div className="h-screen">
            <div className="flex flex-col py-2">
                <div className="flex space-x-2 hover:cursor-pointer hover:bg-gray-800 p-2 rounded-lg" onClick={() => {
                    setOpenControls(false)
                    if(setSheetState) setSheetState(false)
                    router.push("/home")
                }}>
                    <Home className="text-primary hover:cursor-pointer"></Home>
                    {show && (
                        <p>Home</p>
                    )}
                </div>
                <div className="flex space-x-2 hover:cursor-pointer hover:bg-gray-800 p-2 rounded-lg" onClick={() => {
                    setOpenControls(false)
                    if(setSheetState) setSheetState(false)
                    router.push("/home/playlist")
                }}>
                    <ListEnd className="text-primary hover:cursor-pointer"/>
                    {show && (
                        <p>Playlists</p>
                    )}
                </div>
                <div className="flex items-center space-x-2 hover:cursor-pointer hover:bg-gray-800 p-2 rounded-lg" onClick={() => {
                    setOpenControls(false)
                    if(setSheetState) setSheetState(false)
                    router.push("/home/youtube")
                }}>
                    <div
                        className="size-6 bg-primary"
                        style={{
                            mask: "url('/youtubemusic.svg') center / contain no-repeat",
                            WebkitMask: "url('/youtubemusic.svg') center / contain no-repeat",
                        }}
                    />
                    {show && (
                        <p>Youtube</p>
                    )}
                </div>
            </div>
        </div>
    )
}