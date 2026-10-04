import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import './Cursor.css'

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const symbolRef = useRef<HTMLDivElement>(null)

  // Disable custom cursor on mobile viewports and touch devices
  if (
    typeof window !== 'undefined' &&
    (window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0)
  ) {
    return null
  }

  useEffect(() => {
    const ring = ringRef.current
    const symbol = symbolRef.current
    if (!ring || !symbol) return

    // Smooth lag on ring, instantaneous tracking on the 𓆰𓆪 symbol
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })
    const xSymbol = gsap.quickTo(symbol, 'x', { duration: 0.08, ease: 'power3.out' })
    const ySymbol = gsap.quickTo(symbol, 'y', { duration: 0.08, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      xRing(e.clientX)
      yRing(e.clientY)
      xSymbol(e.clientX)
      ySymbol(e.clientY)
    }

    // Scale effects on interactive targets
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const contactText = target.closest('[data-cursor="contact-text"]')
      if (contactText) {
        gsap.to(ring, { scale: 0, opacity: 0, duration: 0.2, ease: 'power2.out' })
        gsap.to(symbol, { scale: 0, opacity: 0, duration: 0.2, ease: 'power2.out' })
        return
      }

      const interactive = target.closest('a, button, [data-cursor], .bento-card, .portrait-wrapper')
      if (interactive) {
        gsap.to(ring, {
          scale: 1.4,
          opacity: 0.9,
          borderColor: 'rgba(255, 51, 75, 0.7)',
          duration: 0.25,
          ease: 'power2.out',
        })
        gsap.to(symbol, {
          scale: 1.25,
          color: '#ff334b',
          duration: 0.25,
          ease: 'power2.out',
        })
      } else {
        gsap.to(ring, {
          scale: 1,
          opacity: 0.65,
          borderColor: 'rgba(255, 51, 75, 0.35)',
          duration: 0.25,
          ease: 'power2.out',
        })
        gsap.to(symbol, {
          scale: 1,
          color: '#ffffff',
          duration: 0.25,
          ease: 'power2.out',
        })
      }
    }

    // Click press feedback
    const onMouseDown = () => {
      gsap.to(symbol, { scale: 0.85, duration: 0.12, ease: 'power2.out' })
      gsap.to(ring, { scale: 0.8, duration: 0.12, ease: 'power2.out' })
    }

    const onMouseUp = () => {
      gsap.to(symbol, { scale: 1, duration: 0.15, ease: 'power2.out' })
      gsap.to(ring, { scale: 1, duration: 0.15, ease: 'power2.out' })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onMouseDown, { passive: true })
    window.addEventListener('mouseup', onMouseUp, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={symbolRef} className="cursor-symbol" aria-hidden="true">
        𓆰𓆪
      </div>
    </>
  )
}
