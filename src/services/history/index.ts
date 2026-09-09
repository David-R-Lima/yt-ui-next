import { api } from '../api'
import { IPaginationResponse } from '../pagination'
import { History } from './types'
import { OrderBy } from '../enums/order-by'

export interface getHistoryProps {
  page?: number
  limit?: number
  order_by?: OrderBy
  text?: string
}

export async function GetHistory({ page, limit, order_by, text }: getHistoryProps) {
  const { data } = await api.get<{
    history: History[]
    meta: IPaginationResponse
  }>('/history', {
    params: {
      page,
      limit,
      order_by,
      text,
    },
  })

  return data
}

interface AddSongProps {
  song_id: string
}

export async function AddSongToHistory(props: AddSongProps) {
  await api.post('/history/' + props.song_id)
}

export async function GetQuickSelect() {
  const { data } = await api.get<History[]>('/history/quick')

  return data
}
