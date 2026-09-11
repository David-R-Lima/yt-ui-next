import { Colors } from '@//enums/colors'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ControlsState {
  color: Colors
  hydrated: boolean
  setColor: (color: Colors) => void
  setHydrated: (hydrated: boolean) => void
}

export const useAppSettingsStore = create<ControlsState>()(
  persist(
    (set) => ({
      color: Colors.blue,
      hydrated: false,

      setColor: (color) => set({ color }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: 'app-settings',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)
