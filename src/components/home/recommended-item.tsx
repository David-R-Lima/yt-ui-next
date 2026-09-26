import { Song } from "@/services/songs/types"
import UseControls from "@/store/song-control-store"
import Link from "next/link"

interface Props {
    item: Song
}

export function RecommendedItem({ item }: Props) {
    const { currentSong, setCurrentSong, isPlaying } = UseControls()

    const isCurrent = currentSong === item && isPlaying

    return (
        <div
            className="flex items-center gap-4 min-w-0 cursor-pointer"  
        >
            {item?.img_url && (
                <img
                    className="size-12 shrink-0 rounded-lg object-cover hover:opacity-50"
                    src={item.img_url}
                    alt=""
                    onClick={() => {
                        if (item) {
                            setCurrentSong(item)
                        }
                    }}
                />
            )}

            <div className="min-w-0 flex-1">
                {item?.title && (
                    <h1
                        className={`truncate font-medium hover:opacity-50 ${
                            isCurrent
                                ? "animate-pulse text-primary"
                                : ""
                        }`}
                        onClick={() => {
                            if (item) {
                                setCurrentSong(item)
                            }
                        }}
                    >
                        {item.title}
                    </h1>
                )}

                    {item?.artist && (() => {
                        const artists = [
                            ...new Set(
                                item.artist
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
    )
}