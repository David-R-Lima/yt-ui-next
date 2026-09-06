import { GetHistory } from "@/services/history";
import { useQuery } from "@tanstack/react-query";

export function UseLastHeardSong() {
    const query = useQuery({
        queryKey: ['last-heard-song'],
        queryFn: async () => {
            return await GetHistory({
                page: 1,
                limit: 1
            })
        }
    })

    return query
}