'use client'

import { UseLastHeardSong } from '../hooks/useLastHeardSong'
import UseControls from '@//store/song-control-store'
import { useEffect } from 'react'

export function InitLastHeard() {
  const { data, isSuccess } = UseLastHeardSong()
  const setCurrentSong = UseControls((state) => state.setCurrentSong)

  useEffect(() => {
    if (isSuccess && data?.history?.[0]?.song) {
      setCurrentSong(data.history[0].song)
    }
  }, [isSuccess, data, setCurrentSong])

  return null
}
