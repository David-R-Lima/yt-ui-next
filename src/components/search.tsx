"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"

import { useInfiniteQuery } from "@tanstack/react-query"
import { GetSongs } from "../services/songs"
import { useEffect, useRef, useState } from "react"
import UseControls from "@/store/song-control-store"
import { Song } from "@/services/songs/types"

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
              className="flex flex-row items-center hover:cursor-pointer"
            >
              {song.img_url && (
                <img
                  className="size-10 object-cover"
                  src={song.img_url}
                  alt=""
                />
              )}

              <div className="flex flex-col">
                <p className="truncate max-w-40 md:max-w-100 lg:max-w-130">{song.title}</p>
                <div className="flex items-center space-x-2 max-w-40">
                  <p className="truncate">{song.artist}</p>
                </div>
              </div>
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

  const searchRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setText("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <div ref={searchRef} className="block z-30 absolute left-1/2 -translate-x-1/2 w-60 md:w-100 lg:w-150">
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
    </>
  )
}