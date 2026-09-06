'use client'

import { ArrowLeftFromLine, ArrowRightToLine, AudioLines, ChevronDown, ChevronUp, Pause, Play, Repeat, Shuffle, Volume2, VolumeX } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import UseControls from "@/store/song-control-store";
import { Dispatch, SetStateAction } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Slider } from "./ui/slider";
import { DivButton } from "./ui/div-but-button";

interface Props {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    audioRef: React.MutableRefObject<HTMLAudioElement | null>
}


export function OpenCurrentSongSheet({ open, setOpen, audioRef }: Props) {
    const { 
        currentSong, 
        currentTime,
        isPlaying,
        pause, 
        play, 
        previousSong, 
        nextSong, 
        setRepeat, 
        setShuffle, 
        repeat, 
        shuffle,
        volume,
        setVolume,
        setCurrentTime
     } = UseControls()

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
                <DivButton>
                    <ChevronUp />
                </DivButton>
            </SheetTrigger>
            <SheetContent className="h-[100vh]" side="bottom">
                <SheetTitle className="hidden"></SheetTitle>
                <Button className="absolute top-4 right-4" onClick={() => {
                    setOpen(false)
                }}>
                    <ChevronDown />
                </Button>
                                
                <div className="flex flex-col items-center justify-end w-full h-[100%] bg-secondary-foreground space-y-10">
                    <div className="flex items-center justify-center size-150">
                        {currentSong?.img_url ? (
                            <img
                                className="object-cover text-primary rounded"
                                src={currentSong?.img_url}
                                alt={currentSong?.title || "Song image"}
                            />  
                        ) : (
                            <AudioLines className="w-full h-full"/>
                        )}
                        <div className="absolute right-4 top-4">
                            <Button onClick={() => {
                                setOpen(false)
                            }}>
                                <ChevronDown></ChevronDown>
                            </Button>
                        </div>
                    </div>
                    <div className="hidden relative md:flex items-center w-full h-[20%]">
                        {currentSong && (
                            <div className="absolute w-full top-0">
                            <input
                                type="range"
                                min={0}
                                max={currentSong?.duration || 0}
                                step={0.1}
                                value={currentTime}
                                onChange={(e) => {
                                const newTime = parseFloat(e.target.value)
                                if (audioRef.current) {
                                    audioRef.current.currentTime = newTime
                                }
                                }}
                                className="w-full"
                                aria-label="Progress bar"
                            />
                            </div>
                        )}

                        <div className="absolute left-1/2 -translate-x-1/2 flex space-x-4 mt-4">
                            <Button variant="secondary" className="text-accent-foreground" onClick={previousSong}>
                            <ArrowLeftFromLine />
                            </Button>
                            <Button
                                onClick={isPlaying ? pause : play}
                                variant="secondary"
                                className="px-4 py-2 bg-primary"
                            >
                            {isPlaying ? <Pause /> : <Play />}
                            </Button>
                            <Button variant="secondary" className="text-accent-foreground" onClick={nextSong}>
                            <ArrowRightToLine />
                            </Button>
                        </div>
                        <div className="absolute right-6 flex gap-4 items-center mt-4">
                            <Popover>
                                <PopoverTrigger>
                                    <DivButton>
                                        {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                    </DivButton>
                                </PopoverTrigger>
                                <PopoverContent className="flex items-center justify-center w-6 m-2">
                                    <Slider value={[volume * 100]} className="h-28" orientation="vertical" onValueChange={(e) => {
                                        const v = e[0]
                                        setVolume(v / 100)
                                    }}></Slider>
                                </PopoverContent>
                            </Popover>
                            <Button
                            onClick={setRepeat}
                            className="text-accent-foreground"
                            variant={repeat ? 'default' : 'secondary'}
                            >
                            <Repeat size={20} />
                            </Button>
                            <Button
                            onClick={setShuffle}
                            className="text-accent-foreground"
                            variant={shuffle ? 'default' : 'secondary'}
                            >
                            <Shuffle size={20} />
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col relative md:hidden items-center w-full h-[20%]">
                        {currentSong && (
                            <div className="absolute w-full top-0">
                            <input
                                type="range"
                                min={0}
                                max={currentSong?.duration || 0}
                                step={0.1}
                                value={currentTime}
                                onChange={(e) => {
                                const newTime = parseFloat(e.target.value)
                                if (audioRef.current) {
                                    audioRef.current.currentTime = newTime
                                }
                                }}
                                className="w-full"
                                aria-label="Progress bar"
                            />
                            </div>
                        )}
                        <div className="relative top-6 flex items-center space-x-4 mt-4">
                            <Button
                                onClick={setRepeat}
                                className="text-accent-foreground"
                                variant={repeat ? 'default' : 'secondary'}
                            >
                                <Repeat size={20} />
                            </Button>
                            <Button variant="secondary" className="text-accent-foreground" onClick={() => {
                                if(currentTime > 5) {
                                    if (audioRef.current) {
                                        setCurrentTime(0)
                                        audioRef.current.currentTime = 0
                                    }
                                } else {
                                    previousSong()
                                }
                            }}>
                                <ArrowLeftFromLine />
                            </Button>
                            <Button
                                onClick={isPlaying ? pause : play}
                                variant="secondary"
                                className="px-4 py-2 bg-primary size-12"
                            >
                                {isPlaying ? <Pause className="size-6"/> : <Play className="size-6" />}
                            </Button>
                            <Button variant="secondary" className="text-accent-foreground" onClick={nextSong}>
                                <ArrowRightToLine />
                            </Button>
                            
                            <Button
                                onClick={setShuffle}
                                className="text-accent-foreground"
                                variant={shuffle ? 'default' : 'secondary'}
                                >
                                <Shuffle size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}