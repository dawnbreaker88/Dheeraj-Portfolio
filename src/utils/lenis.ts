import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenisInstance: Lenis | null = null
let rafId: number | null = null

export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance

  lenisInstance = new Lenis({
    lerp: 0.09, // Premium, softer scroll interpolation (replaces duration easing)
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    syncTouch: true, // Unifies trackpad/touch swipe gestures with smooth scrolling physics
  })

  // Synchronous ScrollTrigger updates inside the RAF loop to eliminate 1-frame visual latency on pins/parallax
  function update(time: number) {
    if (lenisInstance) {
      lenisInstance.raf(time)
      ScrollTrigger.update()
    }
    rafId = requestAnimationFrame(update)
  }
  rafId = requestAnimationFrame(update)

  return lenisInstance
}

export function getLenis(): Lenis | null {
  return lenisInstance
}

export function destroyLenis() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
}

