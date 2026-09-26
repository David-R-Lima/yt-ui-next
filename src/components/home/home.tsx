import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@//components/ui/card";
import { GetMyLikedPlaylist } from "@//services/youtube";
import { Loader2, MoveLeft, MoveRight } from "lucide-react";
import { YoutubeItem } from "./yt-video-item";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@//components/ui/carousel";
import { useEffect, useRef, useState } from "react";
import { GetQuickSelect } from "@//services/history";
import { QuickSelectItem } from "./quick-select-item";
import { RecommendedItem } from "./recommended-item";
import { GetRecommended } from "@/services/songs";

export function Home() {
    const [quickSelectApi, setQuickSelectApi] = useState<CarouselApi>()

    const historyQuery = useQuery({
        queryKey: ["quick-select"],
        queryFn: GetQuickSelect
    })

    const recommendedQuery = useQuery({
        queryKey: ["recommended"],
        queryFn: GetRecommended
    })

    const items = recommendedQuery.data ?? [];

    const pages = Array.from(
        { length: Math.ceil(items.length / 12) },
        (_, pageIndex) => {
            const pageItems = items.slice(
                pageIndex * 12,
                pageIndex * 12 + 12
            );

            return Array.from({ length: 3 }, (_, columnIndex) =>
                pageItems.slice(columnIndex * 4, columnIndex * 4 + 4)
            );
        }
    );

    const pagesMobile = Array.from(
        { length: Math.ceil(items.length / 4) },
        (_, pageIndex) =>
            items.slice(
                pageIndex * 4,
                pageIndex * 4 + 4
            )
    );

    return (
        <div className="flex flex-col space-y-4 pb-6 w-screen md:w-full h-full p-2 md:p-8 overflow-x-hidden"> 
            <div className="space-y-4 px-4 rounded-lg">
                <h1 className="text-xl">Recent</h1>
                <Carousel setApi={setQuickSelectApi} opts={
                    {
                        dragFree: true
                    }
                }     className="
                        w-full overflow-hidden md:pb-4 min-h-62.5

                        md:hover:overflow-x-auto

                        [&::-webkit-scrollbar]:h-0
                        md:hover:[&::-webkit-scrollbar]:h-2

                        md:hover:[&::-webkit-scrollbar-track]:bg-muted
                        md:hover:[&::-webkit-scrollbar-thumb]:bg-primary
                        md:hover:[&::-webkit-scrollbar-thumb]:rounded-full
                    ">
                    <CarouselContent>
                        {historyQuery.data?.map((items, i) => (
                            <CarouselItem key={i} className="basis-1/2 md:basis-1/3 xl:basis-1/5">
                                <div className="flex flex-col space-y-4">
                                    <QuickSelectItem item={items} key={i}></QuickSelectItem>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            <div className="space-y-4 px-4">
                <h1 className="text-xl">Recommended</h1>
                <Carousel
                    opts={{
                        dragFree: true,
                    }}
                    className="
                        hidden md:block
                        w-full overflow-hidden min-h-70

                        md:hover:overflow-x-auto

                        [&::-webkit-scrollbar]:h-0
                        md:hover:[&::-webkit-scrollbar]:h-2

                        md:hover:[&::-webkit-scrollbar-track]:bg-muted
                        md:hover:[&::-webkit-scrollbar-thumb]:bg-primary
                        md:hover:[&::-webkit-scrollbar-thumb]:rounded-full
                    ">
                    <CarouselContent>
                        {pages.map((page, pageIndex) => (
                            <CarouselItem key={pageIndex}>
                                <div className="grid grid-cols-3 gap-x-8">
                                {page.map((column, columnIndex) => (
                                    <div
                                        key={columnIndex}
                                        className="flex flex-col gap-4"
                                    >
                                    {column.map((item, itemIndex) => (
                                        <RecommendedItem
                                            key={item.id ?? itemIndex}
                                            item={item}
                                        />
                                    ))}
                                    </div>
                                ))}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                <Carousel
                    className="block md:hidden overflow-hidden"
                >
                    <CarouselContent>
                        {pagesMobile.map((page, pageIndex) => (
                            <CarouselItem
                                key={pageIndex}
                                className="basis-full"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-4">
                                    {page.map((item, itemIndex) => (
                                        <RecommendedItem
                                            key={item.id ?? itemIndex}
                                            item={item}
                                        />
                                    ))}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    )
}