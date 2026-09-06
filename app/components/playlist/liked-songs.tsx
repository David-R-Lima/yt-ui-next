import { AudioLines, FunnelIcon, RefreshCcw } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { SongItem } from "../song-item"
import UseControls from "@/store/song-control-store"
import { Playlist } from "@/services/playlist/types"
import { PlaylistSong } from "@/services/playlist-songs/types"
import { UseLikedSongs } from "@/hooks/useLikedSongs"
import { Source } from "@/services/enums/source"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { DivButton } from "../ui/div-but-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { OrderBy } from "@/services/enums/order-by"

const allPlaylist: Playlist = { id: "all", name: "All Songs", playlist_songs: [] }

export function DisplayLikedSongs() {

    const { setSource, setCurrentSong, orderBy } = UseControls()

    const [text, setText] = useState<string | undefined>(undefined)
    const [durationGte, setDurationGte] = useState<number | undefined>(undefined)
    const [durationLte, setDurationLte] = useState<number | undefined>(undefined)
    const [order, setOrder] = useState<OrderBy>(orderBy)
    const [resetFilters, setResetFilters] = useState(false)

    const observerRef = useRef<HTMLDivElement | null>(null)

    const infiniteQuery = UseLikedSongs({
      duration_gte: durationGte,
      duration_lte: durationLte,
      text,
      order_by: order,
    })

    const applyFilters = () => {
      infiniteQuery.refetch()
    }

    useEffect(() => {
      if (resetFilters) {
        infiniteQuery.refetch()
        setResetFilters(false)
      }
    }, [text, durationGte, durationLte, resetFilters])
    
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            infiniteQuery.fetchNextPage() // Trigger fetching the next page
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
    }, [infiniteQuery.hasNextPage, infiniteQuery.fetchNextPage])

    if(infiniteQuery.isPending) {
      return (
        <div className="min-w-full min-h-[85vh] bg-secondary rounded-lg animate-pulse"></div>
      )
    }

    return (
      <div className="flex flex-col w-full h-full">
          <div className="flex items-center min-w-full bg-secondary rounded-t-xl">                
            <div className="px-4 py-2">
              <RefreshCcw className="hover:cursor-pointer" onClick={() => {
                infiniteQuery.refetch()
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
                    <AudioLines className="w-full h-full"/>
                </div>
                <div className="text-xl">
                    <p className="font-extrabold italic">Playlist: Liked songs</p>
                    <p className="font-extrabold italic">Songs: {infiniteQuery.data?.meta.totalItems}</p>
                </div>
            </div>
            <div className="w-full lg:w-[70%] xl:w-[80%] bg-secondary rounded-r-xl p-4 h-full overflow-y-scroll overflow-x-hidden">
                {infiniteQuery.data && infiniteQuery.data.songs.length && infiniteQuery.data.songs.length > 0 ? (
                    infiniteQuery.data.songs.map((data, i) => {

                    const playlistSong: PlaylistSong = {
                      playlist_id: "all",
                      song_id: data.id,
                      song: data
                    }

                    allPlaylist.playlist_songs?.push(playlistSong)

                    return (
                        <div key={i}>
                          <SongItem song={data} onClick={() => {
                              setSource(Source.LIKED)
                              setCurrentSong(data)
                          }} />
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