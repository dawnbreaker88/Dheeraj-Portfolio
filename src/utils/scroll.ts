import { getLenis } from './lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function scrollToSection(href: string, onComplete?: () => void) {
  if (!href || !href.startsWith('#')) return

  // Dispatch event so App preloads all lazy sections immediately
  window.dispatchEvent(new CustomEvent('preload-all-sections'))

  let attempts = 0
  const maxAttempts = 25 // 25 * 20ms = 500ms max timeout

  const checkAndScroll = () => {
    const el = document.querySelector(href)
    if (el) {
      ScrollTrigger.refresh()
      const lenis = getLenis()
      if (lenis) {
        lenis.scrollTo(el as HTMLElement, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 3) })
      } else {
        el.scrollIntoView({ behavior: 'smooth' })
      }
      if (onComplete) onComplete()
    } else if (attempts < maxAttempts) {
      attempts++
      setTimeout(checkAndScroll, 20)
    }
  }

  // Initial delay to allow React state update and DOM mounting
  setTimeout(checkAndScroll, 20)
}
