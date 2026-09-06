'use client'

import { AlignJustify, Disc2, Pause, Play } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import UseControls from "@/store/song-control-store";
import { useEffect, useRef, useState } from "react";
import { DivButton } from "./ui/div-but-button";

export function NextSongsSheet() {
    const { currentSong, playlist, currentIndex, setCurrentSongFromSideBar, isPlaying, play, pause } = UseControls()

    const currentSongRef = useRef<HTMLDivElement>(null);

    const [scroll, setScroll] = useState(false)

    useEffect(() => {
        if (currentSongRef.current) {
            currentSongRef.current.scrollIntoView({ block: 'center' });
        }
    }, [currentSong, scroll]);

    return (
        <Sheet onOpenChange={() => {
            setScroll(!scroll)
        }}>
            <SheetTrigger>
            <DivButton>
                <AlignJustify />
            </DivButton>
            </SheetTrigger>
            <SheetContent className="p-4 w-full">
                <SheetTitle>Next songs</SheetTitle>
                <div className="space-y-4 h-full overflow-y-scroll p-4">
                    {playlist.map((song, i) => {
                        if(i === currentIndex) {
                            return (
                                <div ref={currentSongRef} key={i} className="flex items-center justify-between animate-pulse">
                                    <div className="flex items-center space-x-2">
                                        {song.img_url ? (
                                            <img src={song.img_url} alt="" className="size-12"/>
                                        ) : (
                                            <Disc2 />
                                        )}
                                        <p className="truncate max-w-[150px]">{song.title}</p> 
                                    </div>
                                    {!isPlaying ? (
                                        <Button  onClick={() => {
                                            play()
                                        }}>
                                            <Play/>
                                        </Button>
                                    ) : (
                                        <Button onClick={() => {
                                            pause()
                                        }}>
                                            <Pause/>
                                        </Button>
                                    )}
                                </div>
                            )
                        }

                        return (
                            <div key={i} className="flex items-center justify-between space-x-2">
                                <div className="flex items-center space-x-2">
                                    {song.img_url ? (
                                        <img src={song.img_url} alt="" className="size-12"/>
                                    ) : (
                                        <Disc2 />
                                    )}
                                    <p className="truncate max-w-[200px]">{song.title}</p> 
                                </div>
                                <Button onClick={() => {
                                    setCurrentSongFromSideBar(i)
                                }}>
                                    <Play />
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}