"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface WaveformBar {
  id: number
  height: number
  delay: number
}

export function AudioWaveform() {
  const [bars, setBars] = useState<WaveformBar[]>([])

  useEffect(() => {
    // Generate random waveform bars
    const newBars = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      height: Math.random() * 40 + 10,
      delay: i * 0.05,
    }))
    setBars(newBars)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Center waveform cluster */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-end justify-center gap-[2px] h-32 opacity-15">
          {bars.map((bar) => (
            <motion.div
              key={bar.id}
              className="w-1 rounded-full"
              style={{
                height: `${bar.height}px`,
                background: "linear-gradient(180deg, #d4af37 0%, #e5e4e2 50%, #d4af37 100%)",
              }}
              animate={{
                height: [
                  `${bar.height}px`,
                  `${Math.random() * 30 + 20}px`,
                  `${bar.height}px`,
                ],
              }}
              transition={{
                duration: 1 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: bar.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating particles */}
      <FloatingParticle count={8} />

      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    </div>
  )
}

interface FloatingParticleProps {
  count: number
}

function FloatingParticle({ count }: FloatingParticleProps) {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 5,
    }))
  )

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: "linear-gradient(135deg, #d4af37 0%, #e5e4e2 100%)",
            opacity: 0.08,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </>
  )
}

interface PulseRingProps {
  color?: string
  size?: number
  speed?: number
}

export function PulseRing({
  color = "#22c55e",
  size = 40,
  speed = 2,
}: PulseRingProps) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.div
        className="absolute rounded-full border-2"
        style={{
          width: size,
          height: size,
          borderColor: color,
        }}
        animate={{
          scale: [1, 2],
          opacity: [0.8, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute rounded-full border-2"
        style={{
          width: size,
          height: size,
          borderColor: color,
        }}
        animate={{
          scale: [1, 2],
          opacity: [0.8, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "easeOut",
          delay: speed / 2,
        }}
      />
      <div
        className="rounded-full"
        style={{
          width: size / 4,
          height: size / 4,
          backgroundColor: color,
        }}
      />
    </div>
  )
}

interface StudioPulseProps {
  isActive: boolean
  studioName?: string
}

export function StudioPulse({ isActive, studioName }: StudioPulseProps) {
  if (!isActive) return null

  return (
    <div className="relative flex items-center gap-2">
      <PulseRing color="#22c55e" size={36} speed={2} />
      {studioName && (
        <motion.span
          className="text-sm font-medium text-green-500"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {studioName}
        </motion.span>
      )}
    </div>
  )
}

export function RecordingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <motion.div
          className="w-3 h-3 bg-red-500 rounded-full"
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-red-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <motion.span
        className="text-sm font-medium text-red-500"
        animate={{
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        REC
      </motion.span>
    </div>
  )
}
