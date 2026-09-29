import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from '../../utils/gsapSetup'
import { getLenis } from '../../utils/lenis'
import ImageTrail from '../ImageTrail/ImageTrail'
import './BirthdaySecretModal.css'

const FUN_IMAGES = [
  '/fun/WhatsApp Image 2026-09-29 at 20.25.46.png',
  '/fun/WhatsApp Image 2026-09-29 at 20.25.46 (1).png',
  '/fun/WhatsApp Image 2026-09-29 at 20.25.46 (2).png',
  '/fun/WhatsApp Image 2026-09-29 at 20.25.47.png',
  '/fun/WhatsApp Image 2026-09-29 at 20.26.24.png',
  '/fun/WhatsApp Image 2026-09-29 at 20.26.24 (1).png',
  '/fun/WhatsApp Image 2026-09-29 at 20.26.24 (2).png',
]

interface BirthdaySecretModalProps {
  isOpen: boolean
  onClose: () => void
}

// Lightweight synthesized celebration sound using Web Audio API (zero external assets needed)
function playCelebrationSfx() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()

    // Chime notes: C5, E5, G5, B5, C6
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08)

      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + idx * 0.08)
      osc.stop(ctx.currentTime + idx * 0.08 + 0.65)
    })
  } catch {
    // AudioContext blocked or not allowed until user interaction
  }
}

// Particle Canvas for celebratory floating dust and hover sparks
function SecretCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Ambient floating particles
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: -Math.random() * 0.8 - 0.2,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.4 ? 'rgba(250, 204, 21, ' : 'rgba(168, 85, 247, ',
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY

        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.alpha})`
        ctx.shadowBlur = 12
        ctx.shadowColor = p.color.includes('250') ? '#FACC15' : '#A855F7'
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return <canvas ref={canvasRef} className="birthday-secret-canvas" aria-hidden="true" />
}

export default function BirthdaySecretModal({ isOpen, onClose }: BirthdaySecretModalProps) {
  const [step, setStep] = useState<'prompt' | 'secret'>('prompt')
  const [isBhaijaan, setIsBhaijaan] = useState(false)
  const [hasTriggeredAudio, setHasTriggeredAudio] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const textHeadingRef = useRef<HTMLHeadingElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)

  // Manage Lenis & body scroll lock
  useEffect(() => {
    const lenis = getLenis()
    if (isOpen) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
      setStep('prompt')
      setIsBhaijaan(false)
    } else {
      lenis?.start()
      document.body.style.overflow = ''
    }

    return () => {
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleEnterSecret = () => {
    setStep('secret')
    playCelebrationSfx()
  }

  // Handle hover effect over the name
  const handleNameHover = useCallback(() => {
    if (!isBhaijaan) {
      setIsBhaijaan(true)
      if (!hasTriggeredAudio) {
        playCelebrationSfx()
        setHasTriggeredAudio(true)
      }
      if (nameRef.current) {
        gsap.fromTo(
          nameRef.current,
          { scale: 0.9, y: 10, filter: 'blur(8px)' },
          { scale: 1.1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'back.out(2)' }
        )
      }
    }
  }, [isBhaijaan, hasTriggeredAudio])

  const handleNameLeave = useCallback(() => {
    setIsBhaijaan(false)
    if (nameRef.current) {
      gsap.fromTo(
        nameRef.current,
        { scale: 1.1, y: -10, filter: 'blur(6px)' },
        { scale: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'power3.out' }
      )
    }
  }, [])

  // Stagger reveal when secret screen appears
  useEffect(() => {
    if (step === 'secret' && containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.animate-stagger')
      gsap.fromTo(
        elements,
        { y: 35, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 1.1,
          ease: 'cinematic',
          delay: 0.15,
        }
      )
    }
  }, [step])

  const dheerajLetters = useMemo(() => 'DHEERAJ'.split(''), [])
  const bhaijaanLetters = useMemo(() => 'BHAIJAAN'.split(''), [])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="birthday-modal-root" role="dialog" aria-modal="true">
          {/* Backdrop Blur Layer */}
          <motion.div
            className="birthday-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step === 'prompt' ? onClose : undefined}
          />

          {/* STEP 1: Confirmation Prompt */}
          {step === 'prompt' && (
            <motion.div
              className="birthday-prompt-card glass-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="prompt-header">
               
                <button className="prompt-close-btn" onClick={onClose} aria-label="Cancel">
                  ✕
                </button>
              </div>

              <div className="prompt-body">
                <div className="prompt-icon-wrapper">
                  <span className="prompt-key-icon">🔒</span>
                </div>
                <h3 className="prompt-title">Do you want to enter secret?</h3>
                <p className="prompt-desc text-meta">
                  A classified birthday surprise has been prepared for Dheeraj.
                </p>
              </div>

              <div className="prompt-actions">
                <button className="prompt-btn prompt-btn-cancel" onClick={onClose} data-cursor="link">
                  Cancel
                </button>
                <button
                  className="prompt-btn prompt-btn-confirm"
                  onClick={handleEnterSecret}
                  data-cursor="link"
                  autoFocus
                >
                  <span>Enter Secret</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Full Black Screen Secret Birthday View */}
          {step === 'secret' && (
            <motion.div
              ref={containerRef}
              className="birthday-secret-viewport"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <SecretCanvas />

              {/* React Bits ImageTrail with funny photos from /fun */}
              <div className="secret-image-trail-container" aria-hidden="true">
                <ImageTrail items={FUN_IMAGES} variant={1} />
              </div>

              {/* Ambient radial lighting */}
              <div className="secret-glow-orb purple-glow" aria-hidden="true" />
              <div className="secret-glow-orb gold-glow" aria-hidden="true" />

              {/* Top Bar with Exit */}
              <header className="secret-top-bar animate-stagger">
                <div className="secret-status-tag">
                  <span className="status-dot" />
                
                </div>
                <button
                  className="secret-exit-btn"
                  onClick={onClose}
                  data-cursor="link"
                  aria-label="Exit secret mode"
                >
                  <span>✕ Exit Secret</span>
                  <kbd className="secret-kbd">ESC</kbd>
                </button>
              </header>

              {/* Main Content Area */}
              <div className="secret-content">
             

                <h1
                  ref={textHeadingRef}
                  className="secret-heading animate-stagger"
                  data-cursor="text"
                >
                  <span className="heading-prefix">HAPPY BIRTHDAY</span>
                  <br />
                  <span
                    ref={nameRef}
                    className={`name-morph-target ${isBhaijaan ? 'is-bhaijaan' : 'is-dheeraj'}`}
                    onMouseEnter={handleNameHover}
                    onMouseLeave={handleNameLeave}
                    data-cursor="link"
                  >
                    <AnimatePresence mode="wait">
                      {!isBhaijaan ? (
                        <motion.span
                          key="dheeraj"
                          className="name-letter-group dheeraj-style"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.25 }}
                        >
                          {dheerajLetters.map((char, i) => (
                            <span
                              key={i}
                              className="char-span"
                              style={{ animationDelay: `${i * 0.05}s` }}
                            >
                              {char}
                            </span>
                          ))}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="bhaijaan"
                          className="name-letter-group bhaijaan-style"
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -20 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                        >
                          {bhaijaanLetters.map((char, i) => (
                            <span
                              key={i}
                              className="char-span gold-char"
                              style={{ animationDelay: `${i * 0.03}s` }}
                            >
                              {char}
                            </span>
                          ))}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </h1>

                {/* Subtitle / Punchline */}
              

              

                {/* Return Button CTA */}
                <div className="secret-cta-wrap animate-stagger">
                  <button
                    className="secret-return-cta"
                    onClick={onClose}
                    data-cursor="link"
                  >
                    <span>Back to Portfolio</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  )
}
