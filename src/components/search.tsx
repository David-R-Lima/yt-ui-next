"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

import { Search } from "lucide-react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { GetSongs } from "../services/songs"
import { useEffect, useRef, useState } from "react"
import UseControls from "@/store/song-control-store"
import { Input } from "./ui/input"
import { Song } from "@/services/songs/types"

export function SearchComboBox() {
  const [open, setOpen] = useState(false)
  const [textFilter, setText] = useState("")

  const { setCurrentSong } = UseControls()
  const observerRef = useRef<HTMLDivElement | null>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["search", textFilter],

    queryFn: async ({ pageParam }) => {
      return GetSongs({
        text: textFilter,
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

    enabled: !!textFilter,
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage()
        }
      },
      { threshold: 0 },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    data,
  ])

  const selectSong = (song: Song) => {
    setCurrentSong(song)
    setOpen(false)
  }

  interface SearchResultsProps {
  songs: Song[]
  observerRef: React.RefObject<HTMLDivElement | null>
  setCurrentSong: (song: Song) => void
  onSelect?: () => void
}

function SearchResults({
  songs,
  observerRef,
  setCurrentSong,
  onSelect,
}: SearchResultsProps) {
  if (songs.length === 0) {
    return <CommandEmpty>No results found.</CommandEmpty>
  }

  return (
    <CommandList>
      <CommandGroup>
        {songs.map((song, index) => {
          const isLast = index === songs.length - 1

          const item = (
            <CommandItem
              key={song.id}
              value={song.title}
              onSelect={() => {
                setCurrentSong(song)
                onSelect?.()
              }}
            >
              {song.title}
            </CommandItem>
          )

          if (isLast) {
            return (
              <div ref={observerRef} key={song.id}>
                {item}
              </div>
            )
          }

          return item
        })}
      </CommandGroup>
    </CommandList>
  )
}

  return (
    <>
      {/* Desktop */}
      <div className="hidden z-20 lg:block absolute left-1/2 -translate-x-1/2 w-100">
        <Command shouldFilter={false}>
          <CommandInput
            value={textFilter}
            onValueChange={setText}
            placeholder="Search..."
          />

          {textFilter && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-md border bg-popover shadow-md">
              <SearchResults
                songs={data?.songs ?? []}
                observerRef={observerRef}
                setCurrentSong={setCurrentSong}
              />
            </div>
          )}
        </Command>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-gray-800">
              <Search className="text-primary" />
            </button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Search...</DialogTitle>

            <Command shouldFilter={false}>
              <CommandInput
                value={textFilter}
                onValueChange={setText}
                placeholder="Search..."
              />

              <SearchResults
                songs={data?.songs ?? []}
                observerRef={observerRef}
                setCurrentSong={setCurrentSong}
                onSelect={() => setOpen(false)}
              />
            </Command>

          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}