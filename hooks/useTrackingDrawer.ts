import { create } from 'zustand'

type TrackingDrawerStore = {
  isOpen: boolean
  activeView: string | null
  openTrackingDrawer: () => void
  closeTrackingDrawer: () => void
  setActiveView: (view: string | null) => void
}

export const useTrackingDrawer = create<TrackingDrawerStore>((set) => ({
  isOpen: false,
  activeView: null,
  openTrackingDrawer: () => set({ isOpen: true, activeView: 'track' }),
  closeTrackingDrawer: () => set({ isOpen: false, activeView: null }),
  setActiveView: (view) => set({ activeView: view })
})) 