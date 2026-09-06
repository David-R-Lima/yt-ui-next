import { create } from 'zustand'
import { Song } from '../services/songs/types'
import { GetNextSongs } from '@/services/songs'
import { Random } from '@/services/enums/random'
import { Source } from '@/services/enums/source'
import { Reverse } from '@/services/enums/reverse'
import { OrderBy } from '@/services/enums/order-by'

interface ControlsState {
  currentSong: Song | undefined
  playlist: Song[]
  currentIndex: number
  isPlaying: boolean
  currentTime: number
  repeat: boolean
  shuffle: boolean
  volume: number
  source: Source
  sourceId: string | undefined
  orderBy: OrderBy
  setOrderBy: (order: OrderBy) => void
  setSource: (source: Source) => void
  setSourceId: (sourceeId: string) => void
  setCurrentSong: (song: Song) => void
  setCurrentSongFromSideBar: (newIndex: number) => void
  clearCurrentSong: () => void
  play: () => void
  pause: () => void
  setCurrentTime: (time: number) => void
  setVolume: (value: number) => void
  setRepeat: () => void
  setShuffle: () => void
  nextSong: () => void
  previousSong: () => void
  handleEndSong: () => void
}

const UseControls = create<ControlsState>((set, get) => ({
  currentSong: undefined,
  currentIndex: 0,
  playlist: [],
  nextSongs: [],
  previousSongs: [],
  isPlaying: false,
  currentTime: 0,
  volume: 0.2,
  repeat: false,
  shuffle: false,
  source: Source.ALL,
  sourceId: undefined,
  orderBy: OrderBy.ASC,
  setOrderBy: (orderBy) => set({ orderBy }),
  setCurrentSong: async (song) => {
    const { shuffle, source, sourceId, orderBy } = get()

    const fetchedSongs = await GetNextSongs({
      source,
      sourceId,
      random: shuffle ? Random.TRUE : Random.FALSE,
      startId: song.id,
    })

    const fetchPreviousSongs = await GetNextSongs({
      source,
      sourceId,
      random: shuffle ? Random.TRUE : Random.FALSE,
      startId: song.id,
      reverse: Reverse.TRUE,
    })

    switch (orderBy) {
      case OrderBy.ASC: {
        set({
          currentSong: song,
          playlist: [...fetchPreviousSongs, song, ...fetchedSongs],
          currentIndex: fetchPreviousSongs.length,
        })
        break
      }
      case OrderBy.DESC: {
        set({
          currentSong: song,
          playlist: [...fetchedSongs.reverse(), song, ...fetchPreviousSongs.reverse()],
          currentIndex: fetchedSongs.length,
        })
        break
      }
    }
  },
  setCurrentSongFromSideBar: async (newIndex: number) => {
    const { playlist, shuffle, source, sourceId, orderBy } = get()

    let tempPlaylist = [...playlist]
    const song = tempPlaylist[newIndex]

    if (!song) return

    const isAsc = orderBy === OrderBy.ASC

    const isAtEnd = isAsc
      ? tempPlaylist.slice(newIndex).length <= 1
      : tempPlaylist.slice(0, newIndex + 1).length <= 1

    const isAtStart = isAsc
      ? tempPlaylist.slice(0, newIndex).length === 0
      : tempPlaylist.slice(newIndex + 1).length === 0

    if (isAtEnd) {
      const fetchedSongs = await GetNextSongs({
        source,
        sourceId,
        random: shuffle ? Random.TRUE : Random.FALSE,
        startId: song.id,
      })

      set({
        currentSong: song,
        playlist: isAsc
          ? [...tempPlaylist, ...fetchedSongs]
          : [...fetchedSongs.reverse(), ...tempPlaylist],
        currentIndex: isAsc ? newIndex : fetchedSongs.length + newIndex,
      })

      return
    }

    if (isAtStart) {
      const fetchedSongs = await GetNextSongs({
        source,
        sourceId,
        random: shuffle ? Random.TRUE : Random.FALSE,
        startId: song.id,
        reverse: Reverse.TRUE,
      })

      set({
        currentSong: song,
        playlist: isAsc
          ? [...fetchedSongs, ...tempPlaylist]
          : [...tempPlaylist, ...fetchedSongs.reverse()],
        currentIndex: isAsc ? fetchedSongs.length : newIndex,
      })

      return
    }

    set({
      currentSong: song,
      currentIndex: newIndex,
    })
  },
  clearCurrentSong: () => set({ currentSong: undefined }),
  setSource: (source) => set({ source }),
  setSourceId: (sourceId) => set({ sourceId }),
  play: async () => {
    // const { shuffle, source, sourceId, currentSong } = get()

    // if (nextSongs && nextSongs.length === 0) {
    //   const next = await GetNextSongs({
    //     random: shuffle ? Random.TRUE : undefined,
    //     source: source,
    //     sourceId: sourceId,
    //     startId: currentSong?.id,
    //   })

    //   setNextSongs(next)
    // }

    set({
      isPlaying: true,
    })
  },
  pause: () => set({ isPlaying: false }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setVolume: (value: number) => set({ volume: value }),
  setRepeat: () => set((state) => ({ repeat: !state.repeat })),
  setShuffle: async () => {
    const { shuffle, source, sourceId, playlist, currentIndex } = get()

    const newShuffleState = !shuffle

    const fetchedSongs = await GetNextSongs({
      random: newShuffleState ? Random.TRUE : undefined,
      source,
      sourceId,
    })

    const preserved = playlist.slice(0, currentIndex + 1)

    set({
      shuffle: newShuffleState,
      playlist: [...preserved, ...fetchedSongs],
    })
  },
  nextSong: async () => {
    const { playlist, currentIndex, source, sourceId, shuffle, orderBy } = get()

    const newIndex = currentIndex + 1

    if (newIndex >= playlist.length - 1) {
      const tempStart = playlist[newIndex] ?? undefined
      const fetchedSongs = await GetNextSongs({
        source,
        sourceId,
        random: shuffle ? Random.TRUE : undefined,
        startId: tempStart ? tempStart.id : undefined,
        reverse: orderBy === OrderBy.ASC ? Reverse.FALSE : Reverse.TRUE,
      })

      if (fetchedSongs.length > 0) {
        let newPlaylist

        if (orderBy === OrderBy.ASC) {
          newPlaylist = [...playlist, ...fetchedSongs]
        } else {
          newPlaylist = [...playlist, ...fetchedSongs.reverse()]
        }

        set({
          playlist: newPlaylist,
          currentIndex: newIndex,
          currentSong: newPlaylist[newIndex],
        })

        get().play()
        return // exit early because we already set the currentSong
      }
    }

    // Normal behavior: move forward in playlist
    if (newIndex < playlist.length) {
      set({
        currentIndex: newIndex,
        currentSong: playlist[newIndex],
      })
      get().play()
    }
  },
  previousSong: async () => {
    const { currentIndex, playlist, source, sourceId, orderBy } = get()

    const newIndex = currentIndex - 1

    let tempPlaylist = [...playlist]
    const tempCurrentSong = tempPlaylist[newIndex]

    if (newIndex <= 0) {
      const fetchedSongs = await GetNextSongs({
        source,
        sourceId,
        startId: tempCurrentSong?.id,
        reverse: orderBy === OrderBy.ASC ? Reverse.TRUE : Reverse.FALSE,
      })

      if (orderBy === OrderBy.ASC) {
        tempPlaylist = [...fetchedSongs, ...tempPlaylist]
      } else {
        tempPlaylist = [...fetchedSongs.reverse(), ...tempPlaylist]
      }

      set({
        currentIndex: fetchedSongs.length,
        currentSong: tempPlaylist[fetchedSongs.length],
        playlist: tempPlaylist,
      })

      get().play()
    } else {
      set({
        currentIndex: newIndex,
        currentSong: tempPlaylist[newIndex],
        playlist: tempPlaylist,
      })

      get().play()
    }
  },
  handleEndSong: () => {
    get().nextSong()
  },
}))

export default UseControls
