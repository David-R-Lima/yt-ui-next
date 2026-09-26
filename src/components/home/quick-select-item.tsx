import { EllipsisVertical } from "lucide-react"
import { History } from "../../services/history/types"
import UseControls from "@/store/song-control-store"
import Link from "next/link"

interface Props {
    item: History
}

export function QuickSelectItem({item}: Props) {
    const { currentSong, setCurrentSong, isPlaying,  } = UseControls()
    
    const isCurrent = currentSong === item.song && isPlaying

    return (
        <div className="w-100 flex items-center hover:cursor-pointer">
            <div className="w-full flex flex-col space-y-2 items-center">
                <div className="w-full hover:opacity-50" onClick={() => {
                    if(item.song) {
                        setCurrentSong(item.song)
                    }
                }}>
                    {item.song?.img_url && (
                        <img className="size-36 md:size-42 rounded-lg object-cover overflow-hidden" src={item.song?.img_url} alt="" />
                    )}
                </div>
                <div className="w-full">
                    {item.song?.title && (
                        <h1
                            className={`truncate hover:opacity-50 font-medium max-w-[35%] md:max-w-[50%] ${
                                isCurrent
                                    ? "animate-pulse text-primary"
                                    : ""
                            }`}
                            onClick={() => {
                                if(item.song) {
                                    setCurrentSong(item.song)
                                }
                            }}
                        >
                            {item.song.title}
                        </h1>
                    )}
                    {item.song?.artist && (() => {
                        const artists = [
                            ...new Set(
                                item.song.artist
                                    .split(",")
                                    .map((artist) => artist.trim())
                                    .filter(Boolean)
                            ),
                        ];

                        return (
                            <div className="flex items-center gap-1 max-w-[35%] md:max-w-[50%] truncate text-sm text-muted-foreground">
                                {artists.map((artist, i) => (
                                    <Link
                                        key={artist}
                                        href={`/home/artist/${encodeURIComponent(artist)}`}
                                        className="hover:text-primary hover:underline"
                                    >
                                        {artist}
                                        {i < artists.length - 1 && ","}
                                    </Link>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    )
}