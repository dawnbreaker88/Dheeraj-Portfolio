import { useEffect, useRef } from 'react'

export interface MousePosition {
  x: number // 0–1 normalized
  y: number // 0–1 normalized
  clientX: number
  clientY: number
}

export function useMousePosition() {
  const position = useRef<MousePosition>({ x: 0.5, y: 0.5, clientX: 0, clientY: 0 })

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      position.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
        clientX: e.clientX,
        clientY: e.clientY,
      }
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return position
}
