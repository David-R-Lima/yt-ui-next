import { EllipsisVertical } from "lucide-react"
import { History } from "../../services/history/types"
import UseControls from "@/store/song-control-store"

interface Props {
    item: History
}

export function QuickSelectItem({item}: Props) {
    const { currentSong, setCurrentSong, isPlaying } = UseControls()
    return (
        <div className="w-100 flex items-center hover:cursor-pointer">
            <div className="w-full flex flex-col space-y-2 items-center" onClick={() => {
                if(item.song) {
                    setCurrentSong(item.song)
                }
            }}>
                <div className="w-full">
                    {item.song?.img_url && (
                        <img className="size-36 md:size-42 rounded-lg object-cover overflow-hidden" src={item.song?.img_url} alt="" />
                    )}
                </div>
                <div className="w-full">
                    {item.song?.title && (
                        <h1 className={`truncate max-w-[35%] md:max-w-[50%] ${currentSong === item.song && isPlaying ? "animate-pulse text-primary" : ""}`}>{item.song?.title}</h1>
                    )}
                    {item.song?.artist && (
                        <h1 className={`truncate max-w-[35%] md:max-w-[50%] ${currentSong === item.song && isPlaying ? "animate-pulse text-primary" : ""}`}>{item.song?.artist}</h1>
                    )}
                </div>
            </div>
        </div>
    )
}