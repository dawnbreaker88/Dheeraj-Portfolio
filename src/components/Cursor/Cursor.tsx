import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import './Cursor.css'

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  // Disable custom cursor on mobile viewports and touch devices
  if (typeof window !== 'undefined' && (window.innerWidth <= 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0)) {
    return null
  }

  useEffect(() => {
    const ring = ringRef.current!
    const dot = dotRef.current!

    // Smooth lag on ring, tight tracking on dot
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' })
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' })
    const xDot  = gsap.quickTo(dot,  'x', { duration: 0.12, ease: 'power3.out' })
    const yDot  = gsap.quickTo(dot,  'y', { duration: 0.12, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      xRing(e.clientX); yRing(e.clientY)
      xDot(e.clientX);  yDot(e.clientY)
    }

    // Scale ring on any interactive element
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const contactText = target.closest('[data-cursor="contact-text"]')
      if (contactText) {
        gsap.to(ring, { scale: 0, opacity: 0, duration: 0.2, ease: 'power2.out' })
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2, ease: 'power2.out' })
        return
      }

      const interactive = target.closest('a, button, [data-cursor]')
      if (interactive) {
        gsap.to(ring, { scale: 1.9, opacity: 0.5, duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3 })
      } else {
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' })
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3 })
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
    </>
  )
}
