"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { DisplayPlaylist } from "./display-playlist"
import { DisplayAllSongs } from "./all-songs"
import { usePlaylists } from "@/hooks/usePlaylists"
import { DisplayLikedSongs } from "./liked-songs"
import { DisplayHistorySongs } from "./previous-songs"

export function PlaylistCarousel() {
    const playlistQuery = usePlaylists()

    return (
        <div className="flex w-[100vw] h-full">
            <Tabs defaultValue="all" className="flex items-center w-full">
                <TabsList className="flex items-center justify-center w-[60%] md:w-[85%] mb-4">
                    <Carousel   opts={{
                        align: "start",
                        loop: true,
                    }} className="w-full">
                        <CarouselContent className="flex w-full items-center">
                            <CarouselItem className="basis-1/1 md:basis-1/3 lg:basis-1/4">
                                <TabsTrigger value="all" className="font-extrabold hover:cursor-pointer" >All songs</TabsTrigger>
                            </CarouselItem>
                            <CarouselItem className="basis-1/1 md:basis-1/3 lg:basis-1/4">
                                <TabsTrigger value="liked" className="font-extrabold hover:cursor-pointer">Liked</TabsTrigger>
                            </CarouselItem>
                            <CarouselItem className="basis-1/1 md:basis-1/3 lg:basis-1/4">
                                <TabsTrigger value="history" className="font-extrabold hover:cursor-pointer">Previous songs</TabsTrigger>
                            </CarouselItem>
                            {playlistQuery.data && playlistQuery.data.playlists?.map((playlist) => (
                                <CarouselItem key={playlist.id} className="basis-1/1 md:basis-1/4 lg:basis-1/5">
                                        <TabsTrigger value={playlist.id} className="font-extrabold hover:cursor-pointer">{playlist.name ?? "no name"}</TabsTrigger>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </TabsList>
                <TabsContent value="all" className="w-full h-full px-4">
                    <DisplayAllSongs></DisplayAllSongs>
                </TabsContent>
                <TabsContent value="liked" className="w-full h-full px-4">
                    <DisplayLikedSongs></DisplayLikedSongs>
                </TabsContent>
                <TabsContent value="history" className="w-full h-full px-4">
                    <DisplayHistorySongs></DisplayHistorySongs>
                </TabsContent>
                {playlistQuery.data && playlistQuery.data.playlists?.map((playlist) => (
                    <TabsContent key={playlist.id} value={playlist.id} className="w-full h-full px-4">
                        <DisplayPlaylist playlistId={playlist.id}></DisplayPlaylist>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}