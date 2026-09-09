'use client'

import { HeaderState } from "@//enums/header";
import { Home, ListEnd } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { AddPlaylistDialog } from "./add-playlist-dialog";
import { SettingsDialog } from "./setting";
import { SearchComboBox } from "./search";
import { Input } from "./ui/input";

interface HeaderProps {
    state: HeaderState
    setHeaderState: Dispatch<SetStateAction<HeaderState>>
}


export function Header({ setHeaderState }: HeaderProps) {
  return (
    <div className="w-full h-16 flex items-center px-8">
      <div className="ml-auto flex items-center gap-4">
        <SearchComboBox />
        <SettingsDialog />
      </div>
    </div>
  )
}