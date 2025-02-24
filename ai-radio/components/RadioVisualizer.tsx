'use client'

import { useEffect, useRef } from 'react'

interface RadioVisualizerProps {
  isPlaying?: boolean
}

export function RadioVisualizer({ isPlaying = true }: RadioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<{ x: number; y: number; value: number }[]>([])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set up the dot grid
    const rows = 20
    const cols = 30
    const dotSize = 4
    const spacing = 12
    
    canvas.width = cols * spacing
    canvas.height = rows * spacing

    // Initialize dots
    dotsRef.current = []
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dotsRef.current.push({
          x: x * spacing,
          y: y * spacing,
          value: 0
        })
      }
    }

    // Animation function
    let animationFrame: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw dots
      dotsRef.current.forEach(dot => {
        if (isPlaying) {
          // Create wave pattern
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          const distanceFromCenter = Math.sqrt(
            Math.pow(dot.x - centerX, 2) + Math.pow(dot.y - centerY, 2)
          )
          dot.value = Math.sin(Date.now() * 0.003 - distanceFromCenter * 0.05) * 0.5 + 0.5
        }

        ctx.fillStyle = `rgba(0, 0, 0, ${dot.value})`
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isPlaying])

  return (
    <canvas 
      ref={canvasRef}
      className="w-full max-w-md aspect-[4/3] rounded-lg"
    />
  )
} 