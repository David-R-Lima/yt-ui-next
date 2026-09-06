import { AddSong } from "@/services/songs"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Download, Loader2 } from "lucide-react"
import { YouTubeLikedPlayistItem } from "@/services/youtube/types"

interface Props {
    item: YouTubeLikedPlayistItem
}

export function YoutubeItem({item}: Props) {
    const downloadSongMutation = useMutation({
        mutationKey: ["download"],
        mutationFn: AddSong,
        onSuccess: () => {
            toast.success("Downloaded song")
        },
        onError: () => {
            toast.error("Something went wrong!")
        }
    })

    return (
        <div className="flex justify-between p-4">
            <div className="flex items-center space-x-2 w-[70%] max-w-[70%]">
                {item.snippet.thumbnails.high?.url && (
                    <img className="size-12 rounded-lg overflow-hidden" src={item.snippet.thumbnails.high?.url} alt="" />
                )}
                {item.snippet.title && (
                    <h1 className="truncate max-w-[90%]">{item.snippet.title}</h1>
                )}
            </div>
            {item.snippet.resourceId.videoId && !item.downloaded && !downloadSongMutation.isPending && (
                <Download className="hover:cursor-pointer hover:animate-pulse hover:text-primary" size={32} onClick={() => {
                    downloadSongMutation.mutate({
                        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                    })
                }} />
            )}
            {item.snippet.resourceId.videoId && downloadSongMutation.isPending && (
                <Loader2 className="animate-spin" />
            )}
        </div>
    )
}