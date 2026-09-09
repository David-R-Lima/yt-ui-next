import { api } from "../api";

interface Props {
    song_id: string;
}

export async function UpdateNowListening({ song_id }: Props) {
    const { data } = await api.post('/now-listening', {
        song_id: song_id ?? "",
        current_time: 0,
    })

    return data
}