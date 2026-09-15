import { History } from "../../services/history/types"
import UseControls from "@/store/song-control-store"

interface Props {
    item: History
}

export function RecommendedItem({ item }: Props) {
    const { currentSong, setCurrentSong, isPlaying } = UseControls()

    const isCurrent = currentSong === item.song && isPlaying

    return (
        <div
            className="flex items-center gap-4 min-w-0 cursor-pointer"
            onClick={() => {
                if (item.song) {
                    setCurrentSong(item.song)
                }
            }}
        >
            {item.song?.img_url && (
                <img
                    className="size-12 shrink-0 rounded-lg object-cover"
                    src={item.song.img_url}
                    alt=""
                />
            )}

            <div className="min-w-0 flex-1">
                {item.song?.title && (
                    <h1
                        className={`truncate font-medium ${
                            isCurrent
                                ? "animate-pulse text-primary"
                                : ""
                        }`}
                    >
                        {item.song.title}
                    </h1>
                )}

                {item.song?.artist && (
                    <p
                        className={`truncate text-sm text-muted-foreground ${
                            isCurrent
                                ? "animate-pulse text-primary"
                                : ""
                        }`}
                    >
                        {item.song.artist}
                    </p>
                )}
            </div>
        </div>
    )
}