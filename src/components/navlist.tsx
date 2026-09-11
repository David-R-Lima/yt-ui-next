'use client'

import { Home, ListEnd } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export function NavList({show, setSheetState}: {show: boolean, setSheetState: Dispatch<SetStateAction<boolean>> | undefined}) {
    const router = useRouter()
    return (
        <div className="h-screen">
            <div className="flex flex-col py-2">
                <div className="flex space-x-2 hover:cursor-pointer hover:bg-gray-800 p-2 rounded-lg" onClick={() => {
                    if(setSheetState) setSheetState(false)
                    router.push("/")
                }}>
                    <Home className="text-primary hover:cursor-pointer"></Home>
                    {show && (
                        <p>Home</p>
                    )}
                </div>
                <div className="flex space-x-2 hover:cursor-pointer hover:bg-gray-800 p-2 rounded-lg" onClick={() => {
                    if(setSheetState) setSheetState(false)
                    router.push("/playlist")
                }}>
                    <ListEnd className="text-primary hover:cursor-pointer"/>
                    {show && (
                        <p>Playlists</p>
                    )}
                </div>
            </div>
        </div>
    )
}