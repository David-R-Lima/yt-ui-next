'use client'

import { HeaderState } from "@/enums/header";
import { Home, ListEnd } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { AddPlaylistDialog } from "./add-playlist-dialog";
import { SettingsDialog } from "./setting";
import { SearchComboBox } from "./search";

interface HeaderProps {
    state: HeaderState
    setHeaderState: Dispatch<SetStateAction<HeaderState>>
}

export function Header({setHeaderState}: HeaderProps) {
    return (
        <div className="w-full h-[50px] flex items-start justify-center">
            <div className=" flex items-center justify-between w-[100%] md:w-[50%] lg:w-[40%] h-full bg-secondary-foreground rounded-none md:rounded-b-xl px-8 py-2">
                <Home className="text-primary hover:cursor-pointer" onClick={() => setHeaderState(HeaderState.HOME)}></Home>
                <ListEnd className="text-primary hover:cursor-pointer" onClick={() => setHeaderState(HeaderState.LISTPLAYLIST)}/>
                <AddPlaylistDialog></AddPlaylistDialog>
                <SearchComboBox></SearchComboBox>
                <SettingsDialog></SettingsDialog>
            </div>
        </div>
    )
}