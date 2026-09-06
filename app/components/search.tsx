"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Search } from "lucide-react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { GetSongs } from "@/services/songs"
import { useEffect, useRef, useState } from "react"
import UseControls from "@/store/song-control-store"

export function SearchComboBox() {
  const [open, setOpen] = useState(false)
  const [textFilter, setText] = useState<string | undefined>(undefined)

  const { setCurrentSong } = UseControls()

  const observerRef = useRef<HTMLDivElement | null>(null)

  const { data, fetchNextPage, refetch, hasNextPage } = useInfiniteQuery({
    queryKey: ["search", textFilter],
    queryFn: async ({pageParam}) => {
      const data = await GetSongs({
        text: textFilter,
        page: pageParam
      })

      return data
    },
    getNextPageParam: ({ meta }) => {
      if(meta.items === 10) {
        return Number(meta.page + 1)
      } else {
        
      }
    },
    initialPageParam: 1,
    select: (data) => {
      const songs = data.pages.flatMap((page) => page.songs)
      const meta = data.pages[data.pages.length - 1].meta

      return {
        songs,
        meta
      }
    },
    enabled: !!textFilter
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      if(textFilter) {
        refetch()
      }
    }, 300)
    return () => {
      clearTimeout(timeout)
    }
  }, [textFilter])

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
  }, [hasNextPage, fetchNextPage, refetch, data])


  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>                
            <Search className="text-primary hover:cursor-pointer"/>
        </DialogTrigger>
        <DialogContent className="flex flex-col min-h-[30vh] max-h-[40vh]">
          <DialogTitle>Search...</DialogTitle>
          <Command shouldFilter={false}>
            <CommandInput onValueChange={(e) => {
              setText(e)
            }} placeholder="Type a command or search..." />
            <CommandList>
            {data?.songs && data?.songs?.length > 0 && (
              <CommandGroup>
                {data?.songs.map((s, i) => {
                  if(i === data.songs.length - 1) {
                    return (
                      <div ref={observerRef} key={i}>
                        <CommandItem key={s.id} onClickCapture={() => {
                          setCurrentSong(s)
                        }}>{s.title}</CommandItem>
                      </div>
                    )
                  }

                  return (
                    <CommandItem key={s.id} onClickCapture={() => {
                      setCurrentSong(s)
                    }}>{s.title}</CommandItem>
                  )
                  })}
                </CommandGroup>
              )}
              {data?.songs.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </DialogContent>
    </Dialog>
  )
}
