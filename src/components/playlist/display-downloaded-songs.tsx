import { GetPlaylist } from "../../services/playlist"
import UseControls from "@//store/song-control-store"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Disc3, FunnelIcon, Loader2, RefreshCcw } from "lucide-react"
import { SongItem } from "../song-item"
import { Source } from "../../services/enums/source"
import { useEffect, useRef, useState } from "react"
import { OrderBy } from "../../services/enums/order-by"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { DivButton } from "../ui/div-but-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { GetOfflineSongs } from "@/services/offline"
import { OfflineSongItem } from "../downloaded-song-item"

export function DisplayDownloaded() {

    const setSource = UseControls(state => state.setSource)
    const setCurrentSong = UseControls(state => state.setCurrentSong)
    const orderBy = UseControls(state => state.orderBy)


    const [text, setText] = useState<string | undefined>(undefined)
    const [durationGte, setDurationGte] = useState<number | undefined>(undefined)
    const [durationLte, setDurationLte] = useState<number | undefined>(undefined)
    const [order, setOrder] = useState<OrderBy>(orderBy)
    const [resetFilters, setResetFilters] = useState(false)

    const { data, isPending, refetch, hasNextPage, fetchNextPage} = useInfiniteQuery({
        queryKey: ["offline-songs"],
        queryFn: ({ pageParam }) => 
            GetOfflineSongs({
                page: pageParam,
                limit: 1,
            }),
            getNextPageParam: (lastPage) => {
                const { page, totalPages } = lastPage.meta

                return page < totalPages ? page + 1 : undefined
            },
            initialPageParam: 1,
            select: (data) => {
                const songs = data.pages.flatMap((page) => page.songs)
                const meta = data.pages[data.pages.length - 1].meta;

                return { songs, meta }
            },
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
        <div className="flex flex-col w-full h-full overflow-y-auto">
            <div className="sticky top-0 z-20 bg-background flex items-center min-w-full rounded-t-xl px-4">              
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
                        <SelectTrigger className="w-45">
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
            <div className="flex justify-between w-full ">
              <div className="w-full rounded-r-xl p-4 h-full">
                {data && data?.songs && data?.songs.length > 0 ? (
                    data?.songs.map((song) => {
                    if (!song) return null

                    return (
                        <div key={song.id}>
                            <OfflineSongItem song={song} onClick={() => {
                                setSource(Source.ALL)
                                setCurrentSong(song)
                            }}/>
                        </div>
                    )
                    })
                ) : (
                    <li className="text-gray-500">No songs found in this playlist.</li>
                )}
                  <div ref={observerRef} className="flex item-center justify-center bg-secondary-foreground m-2 p-2 mt-4 rounded-lg hover:cursor-pointer w-full bg-gray" onClick={() => {
                    fetchNextPage()
                  }}>
                    {isPending ? (<Loader2 size="8" className="animate-spin" />) : ( <p>Load more</p>)}
                  </div>
              </div>
            </div>
        </div>
    )
}