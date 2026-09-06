import { GetPlaylists } from "@/services/playlist";
import { useQuery } from "@tanstack/react-query";


export function usePlaylists () {
    return useQuery({
        queryKey: ['playlist'],
        queryFn: GetPlaylists
    })
}