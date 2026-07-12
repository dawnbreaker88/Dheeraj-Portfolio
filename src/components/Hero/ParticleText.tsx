import React, { useEffect, useRef, useState, startTransition, useCallback } from 'react'

export interface FontSettings {
  fontSize?: string | number
  fontWeight?: string | number
  fontStyle?: string
  fontFamily?: string
}

export interface ParticleTextProps {
  text?: string
  particleColor?: string
  backgroundColor?: string
  particleSize?: number
  particleDensity?: number
  mouseRadius?: number
  returnSpeed?: number
  font?: FontSettings
  verticalAlign?: 'top' | 'center' | 'bottom'
  horizontalAlign?: 'left' | 'center' | 'right'
  style?: React.CSSProperties
}

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
}

export default function ParticleText({
  text = "DHEERAJ",
  particleColor = "#FFFFFF",
  backgroundColor = "transparent",
  particleSize = 2,
  particleDensity = 3,
  mouseRadius = 100,
  returnSpeed = 0.05,
  font = {},
  verticalAlign = "center",
  horizontalAlign = "center",
  style
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animationFrameRef = useRef<number>()
  const [isInitialized, setIsInitialized] = useState(false)
  const [resizeKey, setResizeKey] = useState(0)

  // Track window resizing to re-initialize particle spacing
  useEffect(() => {
    const handleResize = () => {
      setResizeKey(prev => prev + 1)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Helper to dynamically size font based on screen width
  const getResponsiveFontSize = useCallback(() => {
    if (typeof window === 'undefined') return 80
    const w = window.innerWidth
    // Corresponds to CSS clamp(64px, 12vw, 160px)
    return Math.min(160, Math.max(64, w * 0.11))
  }, [])

  // Particle initialization from canvas text drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const timeoutId = setTimeout(() => {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
      const rect = canvas.getBoundingClientRect()
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)

      const width = rect.width
      const height = rect.height

      // Clear for drawing text mapping
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = particleColor

      // Horizontal align mapping
      if (horizontalAlign === "left") {
        ctx.textAlign = "left"
      } else if (horizontalAlign === "right") {
        ctx.textAlign = "right"
      } else {
        ctx.textAlign = "center"
      }

      ctx.textBaseline = "middle"

      const fontSize = getResponsiveFontSize()
      const fontWeight = font.fontWeight || "700"
      const fontStyle = font.fontStyle || "normal"
      const fontFamily = font.fontFamily || '"Quilon", "Cabinet Grotesk", sans-serif'
      
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`

      const padding = fontSize * 0.3
      const maxTextWidth = width - padding * 2

      // Simple wrap text
      const wrapText = (inputText: string) => {
        const inputLines = inputText.split("\n")
        const wrappedLines: string[] = []
        for (const line of inputLines) {
          if (!line.trim()) {
            wrappedLines.push("")
            continue
          }
          const metrics = ctx.measureText(line)
          if (metrics.width <= maxTextWidth) {
            wrappedLines.push(line)
            continue
          }
          const words = line.split(" ")
          let currentLine = ""
          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word
            const testMetrics = ctx.measureText(testLine)
            if (testMetrics.width <= maxTextWidth) {
              currentLine = testLine
            } else {
              if (currentLine) {
                wrappedLines.push(currentLine)
                currentLine = word
              } else {
                wrappedLines.push(word)
              }
            }
          }
          if (currentLine) {
            wrappedLines.push(currentLine)
          }
        }
        return wrappedLines
      }

      const lines = wrapText(text)
      const lineHeight = fontSize * 1.25
      const totalHeight = lines.length * lineHeight

      let startY: number
      if (verticalAlign === "top") {
        startY = lineHeight / 2 + padding
      } else if (verticalAlign === "bottom") {
        startY = height - totalHeight + lineHeight / 2 - padding
      } else {
        startY = (height - totalHeight) / 2 + lineHeight / 2
      }

      let textX: number
      if (horizontalAlign === "left") {
        textX = padding
      } else if (horizontalAlign === "right") {
        textX = width - padding
      } else {
        textX = width / 2
      }

      lines.forEach((line, index) => {
        ctx.fillText(line, textX, startY + index * lineHeight)
      })

      // Get image coordinates of the text pixels
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data
      const particles: Particle[] = []
      const densityGap = Math.max(2, particleDensity)

      for (let y = 0; y < canvas.height; y += densityGap) {
        for (let x = 0; x < canvas.width; x += densityGap) {
          const index = (y * canvas.width + x) * 4
          const alpha = pixels[index + 3]
          if (alpha > 128) {
            const px = x / dpr
            const py = y / dpr
            particles.push({
              x: px,
              y: py,
              baseX: px,
              baseY: py,
              vx: 0,
              vy: 0
            })
          }
        }
      }

      particlesRef.current = particles
      ctx.clearRect(0, 0, width, height) // Clear layout text mapping
      startTransition(() => setIsInitialized(true))
    }, 50)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [text, particleColor, particleDensity, font, horizontalAlign, verticalAlign, resizeKey, getResponsiveFontSize])

  // Animation Loop
  useEffect(() => {
    if (!isInitialized) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      const mouse = mouseRef.current
      const particles = particlesRef.current

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Push particles away from cursor
        if (distance < mouseRadius) {
          const force = (mouseRadius - distance) / mouseRadius
          const angle = Math.atan2(dy, dx)
          // Direction away from mouse with spring force
          particle.vx -= Math.cos(angle) * force * 2.8
          particle.vy -= Math.sin(angle) * force * 2.8
        }

        // Return to anchor base position
        particle.vx += (particle.baseX - particle.x) * returnSpeed
        particle.vy += (particle.baseY - particle.y) * returnSpeed

        // Friction damping
        particle.vx *= 0.92
        particle.vy *= 0.92

        particle.x += particle.vx
        particle.y += particle.vy

        // Draw particle
        ctx.fillStyle = particleColor
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2)
        ctx.fill()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isInitialized, particleColor, particleSize, mouseRadius, returnSpeed, resizeKey])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 }
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        width: "100%",
        height: "100%",
        backgroundColor,
        cursor: "default",
        display: "block"
      }}
    />
  )
}
