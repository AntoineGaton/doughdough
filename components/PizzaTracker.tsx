"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"
import { useOrderTracking } from '@/hooks/useOrderTracking'

const stages = [
  { id: 1, name: "ORDER PLACED" },
  { id: 2, name: "PREP" },
  { id: 3, name: "BAKE" },
  { id: 4, name: "QUALITY CHECK" },
  { id: 5, name: "OUT FOR DELIVERY" },
]

const messages = {
  1: "Your order has been received!",
  2: "We're preparing your order",
  3: "Your order is in the oven!",
  4: "Making sure everything is perfect",
  5: "Your order is on its way!",
}

export default function PizzaTracker() {
  const { status, setStage } = useOrderTracking()
  const [isRainbow, setIsRainbow] = useState(false)

  useEffect(() => {
    if (!status.isDelivered) {
      const timer = setInterval(() => {
        setStage((status.currentStage + 1) % stages.length)
      }, 10000)
      return () => clearInterval(timer)
    }
  }, [status.currentStage, status.isDelivered, setStage])

  useEffect(() => {
    if (status.isComplete) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      setIsRainbow(true)
    } else {
      setIsRainbow(false)
    }
  }, [status.isComplete])

  return (
    <div className={cn(
      "w-full max-w-3xl mx-auto p-6 bg-secondary rounded-xl shadow-xl transition-all duration-500",
      isRainbow && "animate-rainbow"
    )}>
      <h1 className="text-4xl font-bold text-primary mb-8 text-center tracking-wider">
        DOUGHDOUGH&apos;S TRACKER
      </h1>

      <div className="relative mb-8">
        {/* Progress Bar */}
        <div className="h-16 bg-blue-700 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 flex">
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                className={cn(
                  "flex-1 flex items-center justify-center relative",
                  status.currentStage === stage.id && "bg-red-500",
                  status.currentStage > stage.id && "bg-blue-400"
                )}
              >
                <div
                  className={cn(
                    "text-primary text-sm font-semibold z-10",
                    (status.currentStage === stage.id || status.currentStage > stage.id) && "text-primary",
                    "flex flex-col items-center gap-1"
                  )}
                >
                  <span className="text-lg">{stage.id}</span>
                  <span className="text-xs whitespace-nowrap">{stage.name}</span>
                </div>
                {index < stages.length - 1 && (
                  <div
                    className={cn(
                      "absolute right-0 top-0 bottom-0 w-1 bg-blue-700",
                      status.currentStage > stage.id && "bg-blue-400",
                      status.currentStage === stage.id && "bg-red-500"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center text-primary">
        <div className="text-2xl font-bold mb-2">{messages[status.currentStage as keyof typeof messages]}</div>
        <div className="text-sm opacity-80">
          Our Expert Pizza Maker started your order at{" "}
          {status.startTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </div>
      </div>
    </div>
  )
}

