'use client'

import { YoutubeItem } from "@/components/home/yt-video-item"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { GetMyLikedPlaylist } from "@/services/youtube"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader, Loader2, MoveLeft, MoveRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"


export default function Page() {

    const [api, setApi] = useState<CarouselApi>()
    const observerRef = useRef<HTMLDivElement | null>(null)

    const infiniteQuery = useInfiniteQuery({
        queryKey: ["yt-liked"],
        queryFn: async ({ pageParam }) => {
            const res = await GetMyLikedPlaylist({
                pageToken: pageParam === "" ? undefined : pageParam
            })

            return res
        },
        initialPageParam: "",
        getNextPageParam: (lastPage) => {
            return lastPage.nextPageToken ?? undefined
        },
        select: (data) => {
            const res = data.pages.flatMap(page => page.items)

            return {
                items: res,
                nextPageToken: data.pages[data.pages.length - 1].nextPageToken
            }
        }
    })

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

    const youtubeSplicedArray = infiniteQuery.data
    ? Array.from({ length: Math.ceil(infiniteQuery.data.items.length / 4) }, (_, index) =>
        infiniteQuery.data.items.slice(index * 4, index * 4 + 4)
        ) : []

    return (
        <div>
            <div className="space-y-4 p-4 rounded-lg">
                <h1 className="text-lg text-primary p-4">Youtube liked</h1>
                    {youtubeSplicedArray.map((items, i) => (
                        <div key={i} className="basis-1/1 lg:basis-1/2">
                            <div className="flex flex-col">
                                {items.map((item, j) => (
                                    <YoutubeItem item={item} key={j}></YoutubeItem>
                                ))}
                            </div>
                        </div>
                    ))}
                <div ref={observerRef} className="h-full hover:cursor-pointer" onClick={() => {
                            infiniteQuery.fetchNextPage()
                        }}>
                    <Card className="h-full">
                        <CardContent className="flex items-center justify-center h-full">
                            {infiniteQuery.isFetching ? (
                                <Loader2 className="animate-spin"></Loader2>
                            ) : (
                                <p>Load more</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}