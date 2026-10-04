import { lazy, Suspense, useEffect, useState, useRef, ReactNode, useCallback } from 'react'
import './utils/gsapSetup'
import { initLenis } from './utils/lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './styles/globals.css'

import Navbar from './components/Navbar/Navbar'
import Cursor from './components/Cursor/Cursor'
import Hero from './components/Hero/Hero'
import ShowcaseReel from './components/ShowcaseReel/ShowcaseReel'
import About from './components/About/About'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'

// Lazy load heavier scenes
const Portfolio  = lazy(() => import('./components/Portfolio/Portfolio'))
const Ugc        = lazy(() => import('./components/Ugc/Ugc'))
const Philosophy = lazy(() => import('./components/Philosophy/Philosophy'))
const PhotoEditing = lazy(() => import('./components/PhotoEditing/PhotoEditing'))
const Services   = lazy(() => import('./components/Services/Services'))
const Tools      = lazy(() => import('./components/Tools/Tools'))
const Skills     = lazy(() => import('./components/Skills/Skills'))
const Experience = lazy(() => import('./components/Experience/Experience'))
const Contact    = lazy(() => import('./components/Contact/Contact'))

interface LazySectionProps {
  children: ReactNode
  height?: string | number
  index: number
  maxPreloadedIndex: number
  onVisible: (index: number) => void
}

function LazySection({ children, height = '400px', index, maxPreloadedIndex, onVisible }: LazySectionProps) {
  const [hasRendered, setHasRendered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const shouldRender = hasRendered || maxPreloadedIndex >= index

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasRendered(true)
        onVisible(index)
      }
    }, {
      rootMargin: '500px 0px 500px 0px' // Load 500px before approaching viewport
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [index, onVisible])

  // Force ScrollTrigger to refresh once DOM elements are rendered to update positioning math
  useEffect(() => {
    if (shouldRender) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [shouldRender])

  return (
    <div ref={containerRef} style={{ minHeight: shouldRender ? 'auto' : height }}>
      {shouldRender ? children : null}
    </div>
  )
}

export default function App() {
  const [maxPreloadedIndex, setMaxPreloadedIndex] = useState(0)

  const onVisible = useCallback((index: number) => {
    setMaxPreloadedIndex(prev => Math.max(prev, index + 1))
  }, [])

  useEffect(() => {
    const handlePreload = () => {
      setMaxPreloadedIndex(99)
    }
    window.addEventListener('preload-all-sections', handlePreload)
    return () => window.removeEventListener('preload-all-sections', handlePreload)
  }, [])

  useEffect(() => {
    // Force browser to start scroll at top on page reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // Clear hash to prevent browser jumping down to lazy-loaded sections
    if (window.location.hash && window.location.hash !== '#hero') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    // Initialise Lenis smooth scroller
    const lenis = initLenis()

    const resetScroll = () => {
      lenis.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
    }

    // Reset immediately
    resetScroll()

    // Reset after a tiny delay to override any lazy-loaded height calculations
    const scrollTimer = setTimeout(resetScroll, 120)

    // Let ScrollTrigger know about the smooth scroller and refresh after a delay to account for lazy loading
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 1200)

    return () => {
      clearTimeout(scrollTimer)
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  // Spotlight that follows cursor (using hardware-accelerated translate3d to avoid layout reflows)
  useEffect(() => {
    const spotlight = document.querySelector('.spotlight') as HTMLElement | null
    if (!spotlight) return

    const halfSize = 300 // half of 600px width/height

    const onMove = (e: MouseEvent) => {
      const x = e.clientX - halfSize
      const y = e.clientY - halfSize
      spotlight.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      {/* Fixed atmosphere layers */}
      <div className="film-grain-overlay" aria-hidden="true" />
      <div className="spotlight" aria-hidden="true" />

      {/* Custom cursor */}
      <Cursor />

      {/* Navigation */}
      <Navbar />

      {/* Scroll to Top progress widget */}
      <ScrollToTop />

      {/* Main content */}
      <main id="main-content">
        <Hero />
        <ShowcaseReel />
        <About />

        <Suspense fallback={null}>
          <LazySection height="100vh" index={0} maxPreloadedIndex={maxPreloadedIndex} onVisible={onVisible}>
            <Ugc />
          </LazySection>

          <LazySection height="100vh" index={1} maxPreloadedIndex={maxPreloadedIndex} onVisible={onVisible}>
            <Portfolio />
          </LazySection>

          <LazySection height="100vh" index={2} maxPreloadedIndex={maxPreloadedIndex} onVisible={onVisible}>
            <PhotoEditing />
          </LazySection>

          <LazySection height="80vh" index={3} maxPreloadedIndex={maxPreloadedIndex} onVisible={onVisible}>
            <Services />
          </LazySection>

          <LazySection height="30vh" index={4} maxPreloadedIndex={maxPreloadedIndex} onVisible={onVisible}>
            <Philosophy />
          </LazySection>

          <LazySection height="40vh" index={5} maxPreloadedIndex={maxPreloadedIndex} onVisible={onVisible}>
            <Tools />
          </LazySection>

          <LazySection height="80vh" index={6} maxPreloadedIndex={maxPreloadedIndex} onVisible={onVisible}>
            <Skills />
          </LazySection>

          <LazySection height="80vh" index={7} maxPreloadedIndex={maxPreloadedIndex} onVisible={onVisible}>
            <Experience />
          </LazySection>

          <LazySection height="100vh" index={8} maxPreloadedIndex={maxPreloadedIndex} onVisible={onVisible}>
            <Contact />
          </LazySection>
        </Suspense>
      </main>
    </>
  )
}
