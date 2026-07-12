import { useRef, useEffect, useState } from 'react'
import { gsap, useGSAP } from '../../utils/gsapSetup'
import { SplitText } from 'gsap/SplitText'
import SocialWidget from './SocialWidget'
import CircularSpinText from './CircularSpinText'
import ButtonColorChanging from './ButtonColorChanging'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import KaleidoscopeBackground from '../Hero/KaleidoscopeBackground'
import { useMousePosition } from '../../hooks/useMousePosition'
import './Contact.css'

const WHATSAPP_LINK = 'https://wa.me/918758054054'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const particleRef = useRef<HTMLCanvasElement>(null)

  const mousePosition = useMousePosition()
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 })
  const [hoveringHeading, setHoveringHeading] = useState(false)

  // Track mouse coordinates for circular cursor follow
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  useGSAP(() => {
    if (!headingRef.current) return

    // Split text into characters for staggering entrance & hover
    const split = SplitText.create(headingRef.current, {
      type: 'words,chars',
      wordsClass: 'contact-word',
      charsClass: 'contact-char',
    })

    const chars = split.chars

    // Entrance animation
    gsap.set(split.words, { autoAlpha: 0, y: 35 })
    gsap.to(split.words, {
      autoAlpha: 1,
      y: 0,
      stagger: { each: 0.08, from: 'start' },
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    })

    // Individual character hover micro-interactions
    const onCharEnter = (e: Event) => {
      const char = e.currentTarget as HTMLElement
      gsap.to(char, {
        y: -14,
        scale: 1.12,
        rotation: Math.random() > 0.5 ? 10 : -10,
        color: 'var(--color-accent)',
        duration: 0.35,
        ease: 'back.out(2)',
      })
    }

    const onCharLeave = (e: Event) => {
      const char = e.currentTarget as HTMLElement
      gsap.to(char, {
        y: 0,
        scale: 1,
        rotation: 0,
        color: 'var(--color-text-primary)',
        duration: 0.45,
        ease: 'power3.out',
      })
    }

    chars.forEach((char) => {
      char.addEventListener('mouseenter', onCharEnter)
      char.addEventListener('mouseleave', onCharLeave)
    })

    return () => {
      chars.forEach((char) => {
        char.removeEventListener('mouseenter', onCharEnter)
        char.removeEventListener('mouseleave', onCharLeave)
      })
      split.revert()
    }
  }, { scope: sectionRef })

  // Particle canvas that gathers toward cursor
  useEffect(() => {
    const canvas = particleRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let mouseX = 0, mouseY = 0
    const PARTICLE_COUNT = 60
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * section.offsetWidth,
      y: Math.random() * section.offsetHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
    }))

    const resize = () => {
      canvas.width = section.offsetWidth
      canvas.height = section.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMoveSection = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    section.addEventListener('mousemove', onMouseMoveSection)

    let isVisible = false
    let animId: number

    const draw = () => {
      if (!isVisible) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 220) {
          p.vx += (dx / dist) * 0.08
          p.vy += (dy / dist) * 0.08
        }
        p.vx *= 0.94
        p.vy *= 0.94
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        const alpha = dist < 220 ? 0.5 : 0.15
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(106, 90, 249, ${alpha})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        draw()
      } else {
        cancelAnimationFrame(animId)
      }
    }, { threshold: 0.01 })

    observer.observe(section)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', resize)
      section.removeEventListener('mousemove', onMouseMoveSection)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-section scene"
      role="region"
      aria-label="Contact"
    >
      {/* WebGL Kaleidoscope Background */}
      <div className="contact-bg-canvas" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <KaleidoscopeBackground mousePosition={mousePosition} />
        </Canvas>
      </div>

      <canvas ref={particleRef} className="contact-particles" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      {/* Rotating Cursor Text Overlay */}
      <AnimatePresence>
        {hoveringHeading && (
          <motion.div
            style={{
              position: 'fixed',
              left: mousePos.x,
              top: mousePos.y,
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)',
              zIndex: 99999,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <CircularSpinText
              text="CONTACT ME • CONTACT ME • "
              size={110}
              radius={40}
              fontSize={8.5}
              textColor="var(--color-accent)"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="contact-content">
        <span className="text-meta contact-eyebrow">Let's Work Together</span>

        <h2
          ref={headingRef}
          className="text-hero contact-heading"
          data-cursor="contact-text"
          onMouseEnter={() => setHoveringHeading(true)}
          onMouseLeave={() => setHoveringHeading(false)}
          onMouseMove={handleMouseMove}
        >
          Let's Build
          <br />
          Something People
          <br />
          Remember.
        </h2>

        {/* CTA - Interactive Color Changing Button */}
        <div className="contact-cta-wrapper">
          <ButtonColorChanging
            label="Let's Talk"
            link={WHATSAPP_LINK}
            borderRadius={30}
            bgColor="rgba(255, 255, 255, 0.03)"
            accentColor="var(--color-accent)"
            style={{ margin: '0 auto' }}
          />
        </div>

        {/* Dynamic Hover-Expanding Social Widget */}
        <div style={{ marginTop: '60px', position: 'relative', zIndex: 10 }}>
          <SocialWidget
            whatsapp={WHATSAPP_LINK}
            instagram="#"
            linkedin="#"
            behance="#"
            email="mailto:dheeraj@example.com"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer" role="contentinfo">
        {/* Subtle marquee scrolling citation */}
        <div className="footer-marquee" aria-hidden="true">
          <div className="footer-marquee-track">
            <span>UGC EDITING</span>
            <span className="marquee-dot">•</span>
            <span>SHORT FORM</span>
            <span className="marquee-dot">•</span>
            <span>LONG FORM</span>
            <span className="marquee-dot">•</span>
            <span>REEL EDITING</span>
            <span className="marquee-dot">•</span>
            <span>PHOTO EDITING</span>
            <span className="marquee-dot">•</span>
            <span>PREMIERE PRO</span>
            <span className="marquee-dot">•</span>
            <span>DAVINCI RESOLVE</span>
            <span className="marquee-dot">•</span>
            <span>PHOTOSHOP</span>
            <span className="marquee-dot">•</span>
            <span>LIGHTROOM</span>
            <span className="marquee-dot">•</span>
            <span>CAPCUT</span>
            <span className="marquee-dot">•</span>
            <span>CANVA</span>
            <span className="marquee-dot">•</span>

            {/* Duplicate for seamless looping */}
            <span>UGC EDITING</span>
            <span className="marquee-dot">•</span>
            <span>SHORT FORM</span>
            <span className="marquee-dot">•</span>
            <span>LONG FORM</span>
            <span className="marquee-dot">•</span>
            <span>REEL EDITING</span>
            <span className="marquee-dot">•</span>
            <span>PHOTO EDITING</span>
            <span className="marquee-dot">•</span>
            <span>PREMIERE PRO</span>
            <span className="marquee-dot">•</span>
            <span>DAVINCI RESOLVE</span>
            <span className="marquee-dot">•</span>
            <span>PHOTOSHOP</span>
            <span className="marquee-dot">•</span>
            <span>LIGHTROOM</span>
            <span className="marquee-dot">•</span>
            <span>CAPCUT</span>
            <span className="marquee-dot">•</span>
            <span>CANVA</span>
            <span className="marquee-dot">•</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-tagline text-meta">
            Crafted with Motion. Designed with Intention.
          </p>
          <p className="footer-copy text-meta">© {new Date().getFullYear()} Dheeraj</p>
        </div>
      </footer>
    </section>
  )
}
