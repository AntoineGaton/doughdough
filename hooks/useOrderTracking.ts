import { create } from 'zustand'

type OrderStatus = {
  currentStage: number
  lineProgress: number
  startTime: Date
  isComplete: boolean
  isDelivered: boolean
}

type OrderTrackingStore = {
  status: OrderStatus
  setStage: (stage: number) => void
  setProgress: (progress: number) => void
  setDelivered: () => void
  resetTracking: () => void
}

export const useOrderTracking = create<OrderTrackingStore>((set) => ({
  status: {
    currentStage: 0,
    lineProgress: 0,
    startTime: new Date(),
    isComplete: false,
    isDelivered: false
  },
  setStage: (stage) => 
    set((state) => ({ 
      status: { 
        ...state.status, 
        currentStage: stage,
        isComplete: stage === 3,
        isDelivered: state.status.isComplete && stage === 0
      } 
    })),
  setProgress: (progress) =>
    set((state) => ({ 
      status: { 
        ...state.status, 
        lineProgress: progress 
      } 
    })),
  setDelivered: () =>
    set((state) => ({
      status: {
        ...state.status,
        isDelivered: true
      }
    })),
  resetTracking: () =>
    set({
      status: {
        currentStage: 0,
        lineProgress: 0,
        startTime: new Date(),
        isComplete: false,
        isDelivered: false
      },
    }),
})) 