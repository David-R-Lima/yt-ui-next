import { Song } from "@/services/songs/types"
import UseControls from "@/store/song-control-store"

interface Props {
    item: Song
}

export function RecommendedItem({ item }: Props) {
    const { currentSong, setCurrentSong, isPlaying } = UseControls()

    const isCurrent = currentSong === item && isPlaying

    return (
        <div
            className="flex items-center gap-4 min-w-0 cursor-pointer"
            onClick={() => {
                // if (item) {
                //     setCurrentSong(item)
                // }
            }}
        >
            {item?.img_url && (
                <img
                    className="size-12 shrink-0 rounded-lg object-cover"
                    src={item.img_url}
                    alt=""
                />
            )}

            <div className="min-w-0 flex-1">
                {item?.title && (
                    <h1
                        className={`truncate font-medium ${
                            isCurrent
                                ? "animate-pulse text-primary"
                                : ""
                        }`}
                    >
                        {item.title}
                    </h1>
                )}

                {item?.artist && (
                    <p
                        className={`truncate text-sm text-muted-foreground ${
                            isCurrent
                                ? "animate-pulse text-primary"
                                : ""
                        }`}
                    >
                        {item.artist}
                    </p>
                )}
            </div>
        </div>
    )
}