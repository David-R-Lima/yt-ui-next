import { OrderBy } from "@/services/enums/order-by";
import { GetSongs } from "@/services/songs";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Props {
  orderBy?: OrderBy;
  text?: string
  duration_gte?: number
  duration_lte?: number
}

export function UseAllSongs({ orderBy, duration_gte, duration_lte, text } : Props) {
    const infiniteQuery = useInfiniteQuery({
        queryKey: [
          'all-songs'
        ],
        queryFn: ({ pageParam = 1 }) => {
          return GetSongs({
            page: Number(pageParam),
            order_by: orderBy,
            text,
            duration_gte,
            duration_lte
          })
        },
        getNextPageParam: ({ meta }) => {
          if(meta.items === 10) {
            return Number(meta.page + 1)
          }
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