import React, { useRef, useState, useEffect, useCallback } from 'react'
import { getCloudinaryUrl } from '../../utils/cloudinary'

export interface GalleryItem {
  title: string
  image: {
    src: string
    alt?: string
  }
  year: number
}

export interface PhantomInfiniteGalleryProps {
  items?: GalleryItem[]
  cellSize?: number
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  cellPadding?: number
  gap?: number
  arcAmount?: number
  arcMaxAngleDeg?: number
  arcAxis?: 'horizontal' | 'vertical'
  edgeFade?: number
  border?: {
    width: number
    style: string
    color: string
    showTop: boolean
    showBottom: boolean
    showLeft: boolean
    showRight: boolean
  }
  parallaxEnabled?: boolean
  parallaxStrength?: number
  parallaxEase?: number
  parallaxWhileDragging?: boolean
  inertiaEnabled?: boolean
  throwFriction?: number
  throwVelocityScale?: number
  throwMinSpeed?: number
  throwMaxSpeed?: number
  zoomValue?: number
  hoverColor?: string
}

function computePinnedOffset(
  prevSize: number,
  nextSize: number,
  pivot: { x: number; y: number },
  prevOffset: { x: number; y: number }
) {
  const worldX = (pivot.x - prevOffset.x) / prevSize
  const worldY = (pivot.y - prevOffset.y) / prevSize
  return {
    x: pivot.x - worldX * nextSize,
    y: pivot.y - worldY * nextSize
  }
}

function toRadians(deg: number) {
  return (deg * Math.PI) / 180
}

interface ArcTransformOpts {
  cellCenterX: number
  cellCenterY: number
  viewportW: number
  viewportH: number
  arcAxis: 'horizontal' | 'vertical'
  arcMaxAngleDeg: number
  arcAmount: number
}

function calcArcTransform(opts: ArcTransformOpts) {
  const { cellCenterX, cellCenterY, viewportW, viewportH, arcAxis, arcMaxAngleDeg, arcAmount } = opts
  const maxAngle = toRadians(arcMaxAngleDeg) * Math.max(0, Math.min(1, arcAmount))
  if (maxAngle === 0) return { z: 0, yawDeg: 0, pitchDeg: 0, edgeFactor: 0 }

  if (arcAxis === 'horizontal') {
    const dx = (cellCenterX - viewportW / 2) / (viewportW / 2) // -1..1
    const angle = dx * maxAngle
    const radius = viewportW / (2 * Math.sin(Math.max(0.001, maxAngle)))
    const z = -radius * (Math.cos(angle) - 1)
    const yawDeg = -(angle * 180) / Math.PI
    const edgeFactor = Math.min(1, Math.abs(dx))
    return { z, yawDeg, pitchDeg: 0, edgeFactor }
  } else {
    const dy = (cellCenterY - viewportH / 2) / (viewportH / 2)
    const angle = dy * maxAngle
    const radius = viewportH / (2 * Math.sin(Math.max(0.001, maxAngle)))
    const z = -radius * (Math.cos(angle) - 1)
    const pitchDeg = (angle * 180) / Math.PI
    const edgeFactor = Math.min(1, Math.abs(dy))
    return { z, yawDeg: 0, pitchDeg, edgeFactor }
  }
}

export default function PhantomInfiniteGallery({
  items = [
    { title: "Motion Study", image: { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop", alt: "Motion Study" }, year: 2024 },
    { title: "Idle Form", image: { src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=600&auto=format&fit=crop", alt: "Idle Form" }, year: 2023 },
    { title: "Blur Signal", image: { src: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=600&auto=format&fit=crop", alt: "Blur Signal" }, year: 2024 },
    { title: "Still Drift", image: { src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop", alt: "Still Drift" }, year: 2023 }
  ],
  cellSize = 200,
  backgroundColor = "#000000",
  textColor = "#808080",
  cellPadding = 10,
  gap = 12,
  arcAmount = 0.6,
  arcMaxAngleDeg = 28,
  arcAxis = "horizontal",
  edgeFade = 0.25,
  border = {
    width: 1,
    style: "solid",
    color: "rgba(255,255,255,0.08)",
    showTop: false,
    showBottom: true,
    showLeft: true,
    showRight: true
  },
  parallaxEnabled = true,
  parallaxStrength = 0.1,
  parallaxEase = 0.12,
  parallaxWhileDragging = false,
  inertiaEnabled = true,
  throwFriction = 0.92,
  throwVelocityScale = 1,
  throwMinSpeed = 80,
  throwMaxSpeed = 2500,
  zoomValue = 0.7,
  hoverColor = "#6a5af9"
}: PhantomInfiniteGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Consolidate frequently changing states into a single render-state block
  const [layout, setLayout] = useState({
    offsetX: 0,
    offsetY: 0,
    inertiaX: 0,
    inertiaY: 0,
    mouseX: 0,
    mouseY: 0,
    size: cellSize
  })

  // Target values can stay in refs because we only update them inside the animation frame loop
  const targetOffsetRef = useRef({ x: 0, y: 0 })
  const targetMouseOffsetRef = useRef({ x: 0, y: 0 })
  const targetCellSizeRef = useRef(cellSize)
  
  const isDraggingRef = useRef(false)
  const [draggingState, setDraggingState] = useState(false) // Only for cursor visual state updates

  const velocityRef = useRef({ x: 0, y: 0 })
  const lastMoveRef = useRef({ x: 0, y: 0, t: 0 })
  const inertiaActiveRef = useRef(false)
  const pointerIdRef = useRef<number | null>(null)
  const isPressingRef = useRef(false)

  // Make refs match layout block for pointer handlers
  const layoutRef = useRef(layout)
  useEffect(() => {
    layoutRef.current = layout
  }, [layout])

  const pressPosRef = useRef({ x: 0, y: 0 })
  const startOffsetRef = useRef({ x: 0, y: 0 })
  const pressTimerRef = useRef<number | null>(null)
  const lastTimeRef = useRef(performance.now())

  const DRAG_THRESHOLD = 4
  const PRESS_ZOOM_DELAY = 120
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

  const commitInertiaToBase = useCallback(() => {
    const current = layoutRef.current
    const committedX = current.offsetX + current.inertiaX
    const committedY = current.offsetY + current.inertiaY
    
    targetOffsetRef.current = { x: committedX, y: committedY }
    setLayout(prev => ({
      ...prev,
      offsetX: committedX,
      offsetY: committedY,
      inertiaX: 0,
      inertiaY: 0
    }))
    if (inertiaActiveRef.current) inertiaActiveRef.current = false
  }, [])

  const [viewport, setViewport] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect
      setViewport({ w: cr.width, h: cr.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const now = performance.now()
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000)
      lastTimeRef.current = now

      setLayout(prev => {
        // 1. Calculate cell size transitions
        let nextSize = prev.size + (targetCellSizeRef.current - prev.size) * 0.15
        if (Math.abs(nextSize - targetCellSizeRef.current) < 0.05) {
          nextSize = targetCellSizeRef.current
        }

        // 2. Calculate offset drag easing
        let nextOffsetX = prev.offsetX
        let nextOffsetY = prev.offsetY
        if (!isDraggingRef.current) {
          const tx = targetOffsetRef.current.x
          const ty = targetOffsetRef.current.y
          nextOffsetX = prev.offsetX + (tx - prev.offsetX) * 0.15
          nextOffsetY = prev.offsetY + (ty - prev.offsetY) * 0.15
          if (Math.abs(nextOffsetX - tx) < 0.1) nextOffsetX = tx
          if (Math.abs(nextOffsetY - ty) < 0.1) nextOffsetY = ty
        }

        // 3. Calculate inertia velocity friction
        let nextInertiaX = prev.inertiaX
        let nextInertiaY = prev.inertiaY
        if (inertiaEnabled && inertiaActiveRef.current) {
          const f = Math.pow(throwFriction, dt * 60)
          velocityRef.current.x *= f
          velocityRef.current.y *= f
          const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y)
          if (speed < 1) {
            const direction = Math.atan2(velocityRef.current.y, velocityRef.current.x)
            velocityRef.current.x = Math.cos(direction) * 1e-4
            velocityRef.current.y = Math.sin(direction) * 1e-4
          }
          nextInertiaX = prev.inertiaX + velocityRef.current.x * dt
          nextInertiaY = prev.inertiaY + velocityRef.current.y * dt
        }

        // 4. Calculate mouse parallax offsets
        let nextMouseX = prev.mouseX
        let nextMouseY = prev.mouseY
        const suppressParallax = isPressingRef.current || isDraggingRef.current
        if (parallaxEnabled && !suppressParallax) {
          const tx = targetMouseOffsetRef.current.x
          const ty = targetMouseOffsetRef.current.y
          nextMouseX = prev.mouseX + (tx - prev.mouseX) * parallaxEase
          nextMouseY = prev.mouseY + (ty - prev.mouseY) * parallaxEase
          if (Math.abs(nextMouseX - tx) < 0.1) nextMouseX = tx
          if (Math.abs(nextMouseY - ty) < 0.1) nextMouseY = ty
        } else {
          nextMouseX = prev.mouseX + (0 - prev.mouseX) * parallaxEase
          nextMouseY = prev.mouseY + (0 - prev.mouseY) * parallaxEase
          if (Math.abs(nextMouseX) < 0.1) nextMouseX = 0
          if (Math.abs(nextMouseY) < 0.1) nextMouseY = 0
        }

        // 5. Skip state update if values haven't changed to avoid unnecessary React re-renders
        if (
          Math.abs(nextSize - prev.size) < 0.01 &&
          Math.abs(nextOffsetX - prev.offsetX) < 0.01 &&
          Math.abs(nextOffsetY - prev.offsetY) < 0.01 &&
          Math.abs(nextInertiaX - prev.inertiaX) < 0.01 &&
          Math.abs(nextInertiaY - prev.inertiaY) < 0.01 &&
          Math.abs(nextMouseX - prev.mouseX) < 0.01 &&
          Math.abs(nextMouseY - prev.mouseY) < 0.01
        ) {
          return prev
        }

        return {
          offsetX: nextOffsetX,
          offsetY: nextOffsetY,
          inertiaX: nextInertiaX,
          inertiaY: nextInertiaY,
          mouseX: nextMouseX,
          mouseY: nextMouseY,
          size: nextSize
        }
      })

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inertiaEnabled, throwFriction, parallaxEnabled, parallaxEase])

  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect()
    const pivot = rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 }
    const visibleOffset = {
      x: layoutRef.current.offsetX + layoutRef.current.inertiaX,
      y: layoutRef.current.offsetY + layoutRef.current.inertiaY
    }
    const newTargetOffset = computePinnedOffset(layoutRef.current.size, cellSize, pivot, visibleOffset)
    targetCellSizeRef.current = cellSize
    targetOffsetRef.current = newTargetOffset
  }, [cellSize])

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const current = layoutRef.current
    if (inertiaActiveRef.current || current.inertiaX !== 0 || current.inertiaY !== 0) {
      commitInertiaToBase()
    }
    pointerIdRef.current = e.pointerId
    e.currentTarget.setPointerCapture(e.pointerId)
    isPressingRef.current = true
    isDraggingRef.current = false
    setDraggingState(false)
    lastMoveRef.current = { x: e.clientX, y: e.clientY, t: performance.now() }
    velocityRef.current = { x: 0, y: 0 }
    pressPosRef.current = { x: e.clientX, y: e.clientY }
    startOffsetRef.current = { x: current.offsetX, y: current.offsetY }

    if (pressTimerRef.current) window.clearTimeout(pressTimerRef.current)
    pressTimerRef.current = window.setTimeout(() => {
      if (!isDraggingRef.current && isPressingRef.current) {
        const rect = containerRef.current?.getBoundingClientRect()
        const pivot = rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 }
        const newSize = cellSize * zoomValue
        const visibleOffset = {
          x: layoutRef.current.offsetX + layoutRef.current.inertiaX,
          y: layoutRef.current.offsetY + layoutRef.current.inertiaY
        }
        const pinned = computePinnedOffset(layoutRef.current.size, newSize, pivot, visibleOffset)
        targetCellSizeRef.current = newSize
        targetOffsetRef.current = pinned
      }
    }, PRESS_ZOOM_DELAY)
  }, [cellSize, zoomValue, commitInertiaToBase])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isPressingRef.current) {
      const now = performance.now()
      const dt = Math.max(0.001, (now - lastMoveRef.current.t) / 1000)
      const dx = e.clientX - lastMoveRef.current.x
      const dy = e.clientY - lastMoveRef.current.y
      const vx = clamp((dx / dt) * throwVelocityScale, -throwMaxSpeed, throwMaxSpeed)
      const vy = clamp((dy / dt) * throwVelocityScale, -throwMaxSpeed, throwMaxSpeed)
      velocityRef.current.x = vx * 0.6 + velocityRef.current.x * 0.4
      velocityRef.current.y = vy * 0.6 + velocityRef.current.y * 0.4
      lastMoveRef.current = { x: e.clientX, y: e.clientY, t: now }
    }

    const suppressParallax = isPressingRef.current || isDraggingRef.current
    if (parallaxEnabled && containerRef.current && !suppressParallax) {
      const rect = containerRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const reverseX = (centerX - mouseX) * parallaxStrength
      const reverseY = (centerY - mouseY) * parallaxStrength
      targetMouseOffsetRef.current = { x: reverseX, y: reverseY }
    }

    if (!isPressingRef.current) return
    const dx = e.clientX - pressPosRef.current.x
    const dy = e.clientY - pressPosRef.current.y

    if (!isDraggingRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      isDraggingRef.current = true
      setDraggingState(true)
      startOffsetRef.current = { x: layoutRef.current.offsetX, y: layoutRef.current.offsetY }
    }

    if (isDraggingRef.current) {
      const nx = startOffsetRef.current.x + dx
      const ny = startOffsetRef.current.y + dy
      targetOffsetRef.current = { x: nx, y: ny }
      setLayout(prev => ({
        ...prev,
        offsetX: nx,
        offsetY: ny
      }))
    }
  }, [parallaxEnabled, parallaxStrength, throwVelocityScale, throwMaxSpeed])

  const handlePointerUp = useCallback(() => {
    isPressingRef.current = false
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }

    const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y)
    if (inertiaEnabled && speed >= throwMinSpeed) {
      inertiaActiveRef.current = true
    } else {
      inertiaActiveRef.current = false
      setLayout(prev => ({ ...prev, inertiaX: 0, inertiaY: 0 }))
    }
    isDraggingRef.current = false
    setDraggingState(false)

    const rect = containerRef.current?.getBoundingClientRect()
    const pivot = rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 }
    const visibleOffset = {
      x: layoutRef.current.offsetX + layoutRef.current.inertiaX,
      y: layoutRef.current.offsetY + layoutRef.current.inertiaY
    }
    const pinnedBack = computePinnedOffset(layoutRef.current.size, cellSize, pivot, visibleOffset)
    targetMouseOffsetRef.current = { x: 0, y: 0 }
    targetCellSizeRef.current = cellSize
    targetOffsetRef.current = pinnedBack
  }, [cellSize, inertiaEnabled, throwMinSpeed])

  const handlePointerLeave = useCallback(() => {
    targetMouseOffsetRef.current = { x: 0, y: 0 }
  }, [])

  // ── MOBILE RENDER OVERLAY ──────────────────────────────────────────────
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          padding: "16px",
          backgroundColor,
          overflow: "hidden",
          opacity: 0.2, // soft dim overlay
          pointerEvents: "none" // vital: allows scroll actions to pass directly through the background
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              width: "100%",
              height: "140px",
              borderRadius: "6px",
              overflow: "hidden",
              border: `1px solid ${border.color || "rgba(255,255,255,0.08)"}`
            }}
          >
            <img
              src={item.image.src.replace("/upload/", "/upload/f_auto,q_auto,w_300/")}
              alt={item.image.alt || item.title || "Gallery Item"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  // ── GRID CALCULATIONS ──────────────────────────────────────────────────
  const gridCells = []
  const cellWithGap = layout.size + gap
  const totalOffset = {
    x: layout.offsetX + layout.mouseX + layout.inertiaX,
    y: layout.offsetY + layout.mouseY + layout.inertiaY
  }

  // Viewport-based Grid Virtualization: Determine columns & rows dynamically
  const cols = Math.ceil((viewport.w || 800) / cellWithGap) + 3
  const rows = Math.ceil((viewport.h || 600) / cellWithGap) + 3

  const startX = Math.floor(-totalOffset.x / cellWithGap) - 1
  const startY = Math.floor(-totalOffset.y / cellWithGap) - 1

  // Pre-calculate border styles once to avoid inline updates
  const borderTopStyle = border.showTop ? `${border.width}px ${border.style} ${border.color}` : "none"
  const borderLeftStyle = border.showLeft ? `${border.width}px ${border.style} ${border.color}` : "none"
  const borderRightStyle = border.showRight ? `${border.width}px ${border.style} ${border.color}` : "none"
  const borderBottomStyle = border.showBottom ? `${border.width}px ${border.style} ${border.color}` : "none"

  for (let y = startY; y < startY + rows; y++) {
    for (let x = startX; x < startX + cols; x++) {
      const itemIndex = Math.abs((x + y * 3) % items.length)
      const item = items[itemIndex]

      const tileLeft = x * cellWithGap + totalOffset.x
      const tileTop = y * cellWithGap + totalOffset.y
      const tileW = layout.size
      const tileH = layout.size
      
      const cellCenterX = tileLeft + tileW / 2
      const cellCenterY = tileTop + tileH / 2
      
      const { z, yawDeg, pitchDeg, edgeFactor } = calcArcTransform({
        cellCenterX,
        cellCenterY,
        viewportW: viewport.w || 1,
        viewportH: viewport.h || 1,
        arcAxis,
        arcMaxAngleDeg,
        arcAmount
      })

      const scale = 1 - edgeFade * (edgeFactor * edgeFactor)
      const opacity = 1 - 0.4 * (edgeFactor * arcAmount)

      gridCells.push(
        <div
          key={`${x}-${y}`}
          className="gallery-cell-item"
          style={{
            position: "absolute",
            left: tileLeft,
            top: tileTop,
            width: tileW,
            height: tileH,
            borderTop: borderTopStyle,
            borderLeft: borderLeftStyle,
            borderRight: borderRightStyle,
            borderBottom: borderBottomStyle,
            borderRadius: "8px",
            overflow: "hidden",
            cursor: draggingState ? "grabbing" : "grab",
            display: "flex",
            flexDirection: "column",
            padding: `${cellPadding}px`,
            boxSizing: "border-box",
            transformStyle: "preserve-3d",
            willChange: "transform",
            transform: `translate3d(0, 0, ${z}px) rotateY(${yawDeg}deg) rotateX(${pitchDeg}deg) scale(${scale})`,
            opacity
          }}
        >
          {/* Optimized image tag with loading="lazy" and decoding="async" */}
          <img
            src={item?.image?.src ? getCloudinaryUrl(item.image.src, { width: 450 }) : ''}
            alt={item?.image?.alt || item?.title || "Gallery item"}
            loading="lazy"
            decoding="async"
            style={{
              flex: 1,
              width: "100%",
              height: "0px",
              objectFit: "cover",
              borderRadius: "4px",
              pointerEvents: "none"
            }}
          />
        </div>

      )
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor,
        position: "relative",
        overflow: "hidden",
        touchAction: "none",
        cursor: draggingState ? "grabbing" : "grab",
        userSelect: "none",
        perspective: "1000px",
        transformStyle: "preserve-3d",
        ['--hover-color-val' as any]: hoverColor,
        ['--border-color-val' as any]: border.color
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <div style={{ position: "absolute", width: "100%", height: "100%", transformStyle: "preserve-3d" }}>
        {gridCells}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.7) 90%, rgba(0,0,0,0.95) 100%)`
        }}
      />
    </div>
  )
}
