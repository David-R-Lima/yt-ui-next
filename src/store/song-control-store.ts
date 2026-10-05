import { create } from 'zustand'
import { Song } from '../services/songs/types'
import { GetNextSongs } from '../services/songs'
import { Random } from '../services/enums/random'
import { Source } from '../services/enums/source'
import { Reverse } from '../services/enums/reverse'
import { OrderBy } from '../services/enums/order-by'
import { toast } from 'sonner'

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
  setCurrentSongFromNext: (newIndex: number) => void
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
  fetchNextSongs: (id: string) => Promise<Song[]>
  playNext: (song: Song) => void
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
  orderBy: OrderBy.DESC,
  setOrderBy: (orderBy) => set({ orderBy }),
  setCurrentSong: async (song) => {
    const { fetchNextSongs } = get()

    if (!navigator.onLine) {
      set({
        currentSong: song,
        playlist: [song],
        currentIndex: 0,
      })

      return
    }

    const fetchedSongs = await fetchNextSongs(song.id)

    set({
      currentSong: song,
      playlist: [song, ...fetchedSongs],
      currentIndex: 0,
    })
  },
  setCurrentSongFromNext: async (newIndex) => {
    const {
      playlist,
      orderBy,
      fetchNextSongs
    } = get()

    const song = playlist[newIndex]

    if (!song) return

    let fetchedSongs: Song[] = []

    if(playlist.length - 1 === newIndex) {
      fetchedSongs = await fetchNextSongs(song.id)
    }

    const newPlaylist = [
      ...playlist,
      ...fetchedSongs,
    ]

    if (orderBy === OrderBy.ASC) {
      set({
        playlist: newPlaylist,
        currentSong: song,
        currentIndex: fetchedSongs.length + newIndex,
      })
    } else {
      set({
        playlist: newPlaylist,
        currentSong: song,
        currentIndex: newIndex,
      })
    }
  },
  clearCurrentSong: () => set({ currentSong: undefined }),
  setSource: (source) => set({ source }),
  setSourceId: (sourceId) => set({ sourceId }),
  play: async () => {
    set({
      isPlaying: true,
    })
  },
  pause: () => set({ isPlaying: false }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setVolume: (value: number) => set({ volume: value }),
  setRepeat: () => set((state) => ({ repeat: !state.repeat })),
  setShuffle: async () => {
    const { shuffle } = get()

    const newShuffleState = !shuffle

    set({
      shuffle: newShuffleState,
    })
  },
  nextSong: async () => {
    const { playlist, currentIndex, fetchNextSongs } = get()

    const newIndex = currentIndex + 1

    if (newIndex >= playlist.length - 1) {
      const tempStart = playlist[newIndex] ?? undefined

      const fetchedSongs = await fetchNextSongs(tempStart.id)

      if (fetchedSongs.length > 0) {
        let newPlaylist

        newPlaylist = [...playlist, ...fetchedSongs]

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
    const { currentIndex, playlist } = get()

    if(currentIndex === 0) {
      return
    }

    const newIndex = currentIndex - 1

    set({
      currentIndex: newIndex,
      currentSong: playlist[newIndex],
    })

    get().play()
  },
  handleEndSong: () => {
    get().nextSong()
  },
  fetchNextSongs: async (startId: string) => {
    const { source, sourceId, shuffle, orderBy } = get()

    const songs = await GetNextSongs({
      source,
      sourceId,
      random: shuffle ? Random.TRUE : Random.FALSE,
      startId,
      reverse: orderBy === OrderBy.DESC
        ? Reverse.TRUE
        : Reverse.FALSE,
    })

    if(orderBy === OrderBy.DESC) {
      return songs.reverse()
    } else {
      return songs
    }
  },
  playNext: (song: Song) => {
    const { playlist, currentIndex } = get()

    if (playlist[currentIndex]?.id === song.id ) {
      return
    }

    if (playlist[currentIndex + 1]?.id === song.id) {
      return
    }

    const newPlaylist = [
      ...playlist.slice(0, currentIndex + 1),
      song,
      ...playlist.slice(currentIndex + 1),
    ]

    toast.message("Added to queue")

    set({
      playlist: newPlaylist,
    })
  }
}))

export default UseControls
