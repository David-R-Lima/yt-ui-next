import { GetPlaylist } from "../../services/playlist"
import UseControls from "@//store/song-control-store"
import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { Disc3, FunnelIcon, RefreshCcw } from "lucide-react"
import { SongItem } from "../song-item"
import { Source } from "../../services/enums/source"
import { useEffect, useRef, useState } from "react"
import { OrderBy } from "../../services/enums/order-by"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { DivButton } from "../ui/div-but-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Song } from "@/services/songs/types"
import { GetSongs } from "@/services/songs"

interface Props {
    artist: string
}
export function DisplayArtist({ artist }: Props) {

    const { setSource, setSourceId, setCurrentSong, orderBy } = UseControls()

    const queryClient = useQueryClient();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending
    } = useInfiniteQuery({
        queryKey: ["search", artist],

        queryFn: async ({ pageParam }) => {
        return GetSongs({
            text: artist,
            page: pageParam,
        })
        },

        initialPageParam: 1,

        getNextPageParam: ({ meta }) => {
        if (meta.items === 10) {
            return Number(meta.page) + 1
        }

        return undefined
        },

        select: (data) => {
        const songs = data.pages.flatMap((page) => page.songs)

        return {
            songs,
            meta: data.pages[data.pages.length - 1].meta,
        }
        },

        enabled: !!artist,
    })

    const observerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
            if (entry.isIntersecting) {
                fetchNextPage()
            }
            },
            { threshold: 0 },
        )
    
        if (observerRef.current) {
            observer.observe(observerRef.current)
        }
    
        return () => {
            if (observerRef.current) {
            observer.unobserve(observerRef.current)
            }
        }
    }, [hasNextPage, fetchNextPage])


    if(isPending) {
      return (
        <div className="min-w-full min-h-[85vh] bg-secondary rounded-lg animate-pulse"></div>
      )
    }

    return (
        <div className="flex flex-col w-full h-full overflow-y-auto">
            <div className="flex justify-between w-full ">
              <div className="w-full rounded-r-xl p-4 h-full">
                {data && data?.songs && data?.songs.length > 0 ? (
                    data?.songs.map((song) => {
                    if (!song) return null

                    return (
                        <div key={song.id}>
                            <SongItem song={song} onClick={() => {
                                setSource(Source.PLAYLIST)
                                setCurrentSong(song)
                            }}/>
                        </div>
                    )
                    })
                ) : (
                    <li className="text-gray-500">No songs found in this playlist.</li>
                )}
                  <div ref={observerRef}></div>
              </div>
            </div>
        </div>
    )
}