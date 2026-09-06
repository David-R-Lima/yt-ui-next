import { Liked } from "@/services/enums/liked";
import { GetSongs, getSongsProps } from "@/services/songs";
import { useInfiniteQuery } from "@tanstack/react-query";

export function UseLikedSongs({ duration_gte, duration_lte, text, order_by}: getSongsProps) {
    const infiniteQuery = useInfiniteQuery({
        queryKey: [
          'liked-songs'
        ],
        queryFn: ({ pageParam = 1 }) => {
          return GetSongs({
            page: Number(pageParam),
            liked: Liked.TRUE,
            duration_gte,
            duration_lte,
            text,
            order_by
          })
        },
        getNextPageParam: ({ meta }) => {
            return Number(meta.page + 1)
        },
        initialPageParam: 1,
        select: (data) => {
            const songs = data.pages.flatMap((page) => page.songs)
            const meta = data.pages[data.pages.length - 1].meta;

            return { songs, meta }
        },
    })

    return infiniteQuery
}