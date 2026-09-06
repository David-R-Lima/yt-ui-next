import { GetPlaylist } from "@/services/playlist"
import UseControls from "@/store/song-control-store"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Disc3, FunnelIcon, RefreshCcw } from "lucide-react"
import { SongItem } from "../song-item"
import { Source } from "@/services/enums/source"
import { useEffect, useRef, useState } from "react"
import { OrderBy } from "@/services/enums/order-by"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { DivButton } from "../ui/div-but-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

interface Props {
    playlistId: string
}
export function DisplayPlaylist({ playlistId }: Props) {

    const { setSource, setSourceId, setCurrentSong, orderBy } = UseControls()


    const [text, setText] = useState<string | undefined>(undefined)
    const [durationGte, setDurationGte] = useState<number | undefined>(undefined)
    const [durationLte, setDurationLte] = useState<number | undefined>(undefined)
    const [order, setOrder] = useState<OrderBy>(orderBy)
    const [resetFilters, setResetFilters] = useState(false)

    const { data, isPending, refetch, hasNextPage, fetchNextPage} = useInfiniteQuery({
        queryKey: ['playlist', playlistId],
        queryFn: ({pageParam}) => {
            return GetPlaylist({ 
                id: playlistId, 
                page: pageParam  ,
                duration_gte: durationGte,
                duration_lte: durationLte,
                text,
                order_by: order
            })
        },
        getNextPageParam: ({ playlist_songs }) => {
            return Number(playlist_songs.meta.page + 1)
        },
        initialPageParam: 1,
        select: (data) => {
            const allSongs = data.pages.flatMap(page => page.playlist_songs.data);
            const playlist = data.pages[0].playlist;

            return {
                playlist,
                playlist_songs: allSongs,
                meta: data.pages[data.pages.length - 1].playlist_songs.meta
            };
        }
    })

    const applyFilters = () => {
        refetch()
    }

    useEffect(() => {
      if (resetFilters) {
        refetch()
        setResetFilters(false)
      }
    }, [text, durationGte, durationLte, resetFilters])

    const observerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
            if (entry.isIntersecting) {
                fetchNextPage() // Trigger fetching the next page
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
        <div className="flex flex-col w-full h-full">
            <div className="flex items-center min-w-full bg-secondary rounded-t-xl">                
              <div className="px-4 py-2">
                <RefreshCcw className="hover:cursor-pointer" onClick={() => {
                  refetch()
                }}/>
              </div>
              <div className="flex items-center space-x-2">
                <Dialog>
                  <DialogTrigger className="px-4 py-2">
                    <DivButton variant={'outline'}>
                      <FunnelIcon />
                      <p>Filters</p>
                    </DivButton>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="flex flex-col space-x-2">
                      <h1>Order by: </h1>
                      <Select value={order} defaultValue={orderBy} onValueChange={(e) => {
                        setOrder(e as OrderBy)
                      }}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Order by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={OrderBy.ASC}>Asc</SelectItem>
                          <SelectItem value={OrderBy.DESC}>Desc</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-x-2">
                      <h1>Text: </h1>
                      <Input value={text} placeholder='Search' onChange={(e) => {
                        setText(e.target.value)
                      }}/>
                    </div>
                    <div className="space-y-2">
                      <h1>Duration</h1>
                      <div className="flex space-x-4">
                        <div className="">
                          <h2>GTE: </h2>
                          <Input value={durationGte} type="number" onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : undefined;
                            setDurationGte(value);
                          }}></Input>
                        </div>
                        <div>
                          <h2>LTE: </h2>
                          <Input value={durationLte} type="number" onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : undefined;
                            setDurationLte(value);
                          }}></Input>
                        </div>
                      </div>
                    </div>
                    <Button onClick={applyFilters}>Apply filters</Button>
                  </DialogContent>
                </Dialog>
              </div>
              <div>
                <Button variant={'link'} onClick={() => {
                  setText(undefined)
                  setDurationGte(undefined)
                  setDurationLte(undefined)
                  setResetFilters(true)
                }}>Remove filters</Button>
              </div>
            </div>
            <div className="flex justify-between w-full h-[75%] xl:h-[80%]">
              <div className="hidden lg:flex flex-col items-center justify-center w-[30%] xl:w-[20%] h-full p-6 bg-primary rounded-bl-xl">
                <div className="h-[50%] w-[80%]">
                    {data?.playlist.img_url ? (
                        <img src={data?.playlist.img_url ?? ""}></img>
                    ) : (
                        <Disc3 className="w-full h-full" />
                    )}
                </div>
                <div className="text-xl">
                    <p className="font-extrabold italic">Playlist: {data?.playlist.name}</p>
                    <p className="font-extrabold italic">Description: {data?.playlist.description}</p>
                    <p className="font-extrabold italic">Songs: {data?.meta.totalItems}</p>
                </div>
              </div>
              <div className="w-full lg:w-[70%] xl:w-[80%] bg-secondary rounded-r-xl p-4 h-full overflow-y-scroll overflow-x-hidden">
                {data && data?.playlist_songs && data?.playlist_songs.length > 0 ? (
                    data?.playlist_songs.map((playlistSong) => {
                    if (!playlistSong || !playlistSong.song) return null

                    const { song } = playlistSong 

                    return (
                        <div key={playlistSong.song_id}>
                            <SongItem song={song} onClick={() => {
                                setSource(Source.PLAYLIST)
                                setSourceId(playlistId)
                                setCurrentSong(song)
                            }} playlistId={playlistId}/>
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