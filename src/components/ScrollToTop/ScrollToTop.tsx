import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getLenis } from '../../utils/lenis'
import './ScrollToTop.css'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const indicatorRef = useRef<SVGCircleElement>(null)

  // Circular progress SVG values
  const radius = 20
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      
      // Only set state if visibility state actually changes
      setIsVisible(prev => {
        const next = scrolled > 400
        return prev !== next ? next : prev
      })

      // Update SVG indicator strokeDashoffset directly in DOM to avoid React re-renders
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0 && indicatorRef.current) {
        const progress = scrolled / totalHeight
        const offset = circumference - (progress * circumference)
        indicatorRef.current.style.strokeDashoffset = `${offset}`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial trigger
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [circumference])

  const scrollToTop = () => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 3) })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="scroll-to-top glass-card"
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          data-cursor="link"
          aria-label="Scroll to top"
        >
          {/* Progress Ring */}
          <svg className="progress-ring" width="48" height="48">
            <circle
              className="progress-ring-bg"
              cx="24"
              cy="24"
              r={radius}
              strokeWidth="2"
              fill="transparent"
            />
            <circle
              ref={indicatorRef}
              className="progress-ring-indicator"
              cx="24"
              cy="24"
              r={radius}
              strokeWidth="2"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
            />
          </svg>

          {/* Up arrow */}
          <span className="scroll-arrow-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 11V3M7 3L3 7M7 3L11 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
