import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type OrderStatus = {
  currentStage: number
  lineProgress: number
  startTime: Date
  isComplete: boolean
  isDelivered: boolean
  orderId?: string
}

type OrderTrackingStore = {
  status: OrderStatus
  setStage: (stage: number) => void
  setProgress: (progress: number) => void
  setDelivered: () => void
  resetTracking: () => void
}

const stages = [
  { id: 1, name: "ORDER PLACED" },
  { id: 2, name: "PREP" },
  { id: 3, name: "BAKE" },
  { id: 4, name: "QUALITY CHECK" },
  { id: 5, name: "OUT FOR DELIVERY" },
];

export const useOrderTracking = create(
  persist<OrderTrackingStore>(
    (set) => ({
      status: {
        currentStage: 0,
        lineProgress: 0,
        startTime: new Date(),
        isComplete: false,
        isDelivered: false,
        orderId: undefined
      },
      setStage: (stage) => 
        set((state) => ({ 
          status: { 
            ...state.status, 
            currentStage: stage,
            startTime: stage === 1 ? new Date() : state.status.startTime,
            isComplete: stage === stages.length,
            isDelivered: stage === stages.length
          } 
        })),
      setProgress: (progress) =>
        set((state) => ({ 
          status: { 
            ...state.status, 
            lineProgress: progress,
            isComplete: state.status.isComplete
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
            isDelivered: false,
            orderId: undefined
          },
        }),
    }),
    {
      name: 'order-tracking-storage'
    }
  )
) 