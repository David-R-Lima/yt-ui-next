'use client'

import { Controls } from "./components/player";
import { PlaylistCarousel } from "./components/playlist/playlist";
import { Header } from "./components/header";
import { useState } from "react";
import { HeaderState } from "./enums/header";
import { cn } from "./lib/utils";
import { useAppSettingsStore } from "./store/app-settings-store";
import { Home } from "./components/home/home";

function App() {
  const [state, setState] = useState<HeaderState>(HeaderState.HOME)

  const { color } = useAppSettingsStore()

  return (
      <main className={cn("relative h-screen w-screen flex flex-col font-[roboto] font-bold, ", color)}>
        <header>
          <Header state={state} setHeaderState={setState}></Header>
        </header>
        <section className='flex flex-col flex-1 w-full h-[60vh] xl:h-[90vh] max-h-[90vh] overflow-hidden py-6 ' >
          {state === HeaderState.HOME && (
            <Home></Home>
          )}
          {state === HeaderState.LISTPLAYLIST && (
            <PlaylistCarousel></PlaylistCarousel>
          )}
          {state === HeaderState.SETTINGS && (
            <div></div>
          )}
        </section>
        <div className='w-full'>
          <Controls></Controls>
        </div>
      </main>
  );
}

export default App;
