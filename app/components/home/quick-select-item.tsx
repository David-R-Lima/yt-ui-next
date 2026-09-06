import { EllipsisVertical } from "lucide-react"
import { History } from "@/services/history/types"
import UseControls from "@/store/song-control-store"

interface Props {
    item: History
}

export function QuickSelectItem({item}: Props) {
    const { currentSong, setCurrentSong, isPlaying } = UseControls()
    return (
        <div className="flex items-center justify-between hover:cursor-pointer">
            <div className="flex flex-row space-x-2 items-center w-[90%]" onClick={() => {
                if(item.song) {
                    setCurrentSong(item.song)
                }
            }}>
                {item.song?.img_url && (
                    <img className="size-12 rounded-lg overflow-hidden" src={item.song?.img_url} alt="" />
                )}
                {item.song?.title && (
                    <h1 className={`truncate max-w-[70%] ${currentSong === item.song && isPlaying ? "animate-pulse text-primary" : ""}`}>{item.song?.title}</h1>
                )}
            </div>
            <div>
                <EllipsisVertical />
            </div>
        </div>
    )
}