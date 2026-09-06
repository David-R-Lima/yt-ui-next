import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../ui/card";
import { GetMyLikedPlaylist } from "@/services/youtube";
import { Loader2, MoveLeft, MoveRight } from "lucide-react";
import { YoutubeItem } from "./yt-video-item";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../ui/carousel";
import { useEffect, useRef, useState } from "react";
import { GetQuickSelect } from "@/services/history";
import { QuickSelectItem } from "./quick-select-item";


export function Home() {
    const [api, setApi] = useState<CarouselApi>()
    const [quickSelectApi, setQuickSelectApi] = useState<CarouselApi>()

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

    const historyQuery = useQuery({
        queryKey: ["quick-select"],
        queryFn: GetQuickSelect
    })

    const observerRef = useRef<HTMLDivElement | null>(null)
    
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

    const splicedArray = historyQuery.data
    ? Array.from({ length: Math.ceil(historyQuery.data.length / 4) }, (_, index) =>
        historyQuery.data.slice(index * 4, index * 4 + 4)
        )
    : []

    const youtubeSplicedArray = infiniteQuery.data
    ? Array.from({ length: Math.ceil(infiniteQuery.data.items.length / 4) }, (_, index) =>
        infiniteQuery.data.items.slice(index * 4, index * 4 + 4)
        ) : []

    return (
        <div className="flex flex-col w-screen mx-h-[80vh] overflow-y-auto overflow-x-hidden space-y-4 px-2 md:px-20 container-s">
            <div className="space-y-4 bg-primary/5 p-4 rounded-lg">
                <h1>Quick select</h1>
                <div className="flex w-full justify-between">
                    <div className="p-1 text-xl rounded-full hover:cursor-pointer" onClick={() => {
                            quickSelectApi?.scrollPrev(true)
                        }}>
                        <MoveLeft className="" />
                    </div>
                    <div className="p-1 texl-xl rounded-full hover:cursor-pointer" onClick={() => {
                            quickSelectApi?.scrollNext(true)
                        }}>
                        <MoveRight />
                    </div>
                </div>
                <Carousel setApi={setQuickSelectApi}>
                    <CarouselContent className="">
                        {splicedArray.map((items, i) => (
                            <CarouselItem key={i} className="basis-1/1 lg:basis-1/3">
                                <div className="flex flex-col space-y-4">
                                    {items.map((item, j) => (
                                        <QuickSelectItem item={item} key={j}></QuickSelectItem>
                                    ))}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            <div className="space-y-4 bg-red-500/5 p-4 rounded-lg">
                <h1>Youtube liked</h1>
                <div className="flex w-full justify-between">
                    <div className="p-1 text-xl rounded-full hover:cursor-pointer" onClick={() => {
                            api?.scrollPrev(true)
                        }}>
                        <MoveLeft className="" />
                    </div>
                    <div className="p-1 text-xl rounded-full hover:cursor-pointer" onClick={() => {
                            api?.scrollNext(true)
                        }}>
                        <MoveRight />
                    </div>
                </div>
                <Carousel setApi={setApi}>
                    <CarouselContent className="space-x-4">
                        {youtubeSplicedArray.map((items, i) => (
                            <CarouselItem key={i} className="basis-1/1 lg:basis-1/2">
                                <div className="flex flex-col">
                                    {items.map((item, j) => (
                                        <YoutubeItem item={item} key={j}></YoutubeItem>
                                    ))}
                                </div>
                            </CarouselItem>
                        ))}
                        <CarouselItem className="basis-1/3 hover:pointer" onClick={() => {
                            infiniteQuery.fetchNextPage()
                        }}>
                            <div ref={observerRef} className="h-full">
                                <Card className="h-full">
                                    <CardContent className="flex items-center justify-center h-full">
                                        <Loader2  size={128} className="animate-spin text-primary" />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    )
}