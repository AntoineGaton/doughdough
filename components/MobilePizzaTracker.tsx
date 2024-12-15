"use client"

import { useEffect, useState } from "react"
import { Car, Pizza, Timer, CheckCircle } from 'lucide-react'
import { motion } from "framer-motion"
import confetti from 'canvas-confetti'
import { useOrderTracking } from '@/hooks/useOrderTracking'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const CIRCLE_CENTER = 120
const CIRCLE_RADIUS = 80
const STAGES = [
  { icon: Timer, label: "Order Received" },
  { icon: Pizza, label: "Preparing" },
  { icon: CheckCircle, label: "Quality Check" },
  { icon: Car, label: "On The Way" },
  { icon: CheckCircle, label: "Delivered!" },
]

interface MobilePizzaTrackerProps {
  onClose?: () => void;
}

export default function MobilePizzaTracker({ onClose }: MobilePizzaTrackerProps) {
  const { status, setStage, setProgress, resetTracking } = useOrderTracking()
  const router = useRouter();

  const handleMorePizza = () => {
    resetTracking();
    router.push('/#featured-section');
  }

  useEffect(() => {
    if (!status.isDelivered) {
      const stageTimer = setInterval(() => {
        setStage(status.currentStage < STAGES.length - 1 ? status.currentStage + 1 : 0)
      }, 10000)
      return () => clearInterval(stageTimer)
    }
  }, [status.currentStage, status.isDelivered, setStage])

  useEffect(() => {
    if (!status.isDelivered) {
      const lineTimer = setTimeout(() => {
        setProgress((status.currentStage + 1) / STAGES.length)
      }, 9000)
      return () => clearTimeout(lineTimer)
    }
  }, [status.currentStage, status.isDelivered, setProgress])

  useEffect(() => {
    if (status.isComplete) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#ffffff', '#000000']
      })
      // Change first icon to CheckCircle after delivery
      STAGES[0].icon = CheckCircle
    }
  }, [status.isComplete])

  if (status.currentStage === 0 && !status.isComplete) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 bg-primary rounded-xl">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/Doughdough/Doughdough.png"
              alt="Pizzaria Logo"
              width={200}
              height={200}
              className="opacity-80"
            />
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-2">
            No Active Orders
          </h2>
          <p className="text-secondary/80">
            Place an order to start tracking your pizza&apos;s journey!
          </p>
        </div>
      </div>
    )
  }

  const getPointOnCircle = (index: number, total: number) => {
    const angle = 270 + (index * 360) / total
    const x = CIRCLE_CENTER + CIRCLE_RADIUS * Math.cos((angle * Math.PI) / 180)
    const y = CIRCLE_CENTER + CIRCLE_RADIUS * Math.sin((angle * Math.PI) / 180)
    return { x, y }
  }

  const messages = [
    status.isDelivered ? "Delivered!" : "Order Received!",
    "Hot Pizza is Being Prepared",
    "Quality Check in Progress",
    "Hot Pizza is On The Way!"
  ]

  return (
    <div className="w-full h-full bg-primary flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div className="relative">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 240 240">
            <circle
              cx={CIRCLE_CENTER}
              cy={CIRCLE_CENTER}
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="#333"
              strokeWidth="2"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx={CIRCLE_CENTER}
              cy={CIRCLE_CENTER}
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="#ff0000"
              strokeWidth="2"
              strokeDasharray={2 * Math.PI * CIRCLE_RADIUS}
              initial={{ strokeDashoffset: 2 * Math.PI * CIRCLE_RADIUS }}
              animate={{
                strokeDashoffset: 
                  2 * Math.PI * CIRCLE_RADIUS * (1 - status.lineProgress),
              }}
              transform={`rotate(-90 ${CIRCLE_CENTER} ${CIRCLE_CENTER})`}
              transition={{ duration: 1, ease: "easeInOut" }}
            />

            {/* Stage icons */}
            {STAGES.map((stage, index) => {
              const point = getPointOnCircle(index, STAGES.length)
              const Icon = stage.icon
              return (
                <g
                  key={index}
                  transform={`translate(${point.x - 12}, ${point.y - 12})`}
                  className={status.currentStage >= index ? "text-black-500" : "text-gray-600"}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="16"
                    fill="red"
                    className="stroke-current"
                    strokeWidth="1"
                  />
                  <Icon className="w-6 h-6" />
                </g>
              )
            })}
          </svg>

          {/* Center message or More Pizza button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center w-[120px]">
              {status.isComplete ? (
                <button
                  onClick={handleMorePizza}
                  className="bg-secondary text-white px-3 py-1.5 rounded-full text-xs font-bold
                    hover:bg-secondary/90 transition-colors animate-pulse hover:animate-none
                    whitespace-nowrap"
                >
                  More Pizza? 🍕
                </button>
              ) : (
                <motion.p
                  key={status.currentStage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-secondary font-bold text-sm whitespace-normal break-words leading-tight"
                >
                  {messages[status.currentStage]}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}