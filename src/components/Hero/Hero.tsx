import { useRef, useEffect, useState } from 'react'
import { gsap, useGSAP } from '../../utils/gsapSetup'
import ColorBends from './ColorBends'
import ParticleText from './ParticleText'
import './Hero.css'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingWrapperRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { threshold: 0.01 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useGSAP(() => {
    if (!headingWrapperRef.current || !subtitleRef.current || !scrollHintRef.current) return

    // Initial state
    gsap.set(headingWrapperRef.current, { autoAlpha: 0, scale: 0.95, y: 15 })
    gsap.set(subtitleRef.current, { autoAlpha: 0, y: 15 })
    gsap.set(scrollHintRef.current, { autoAlpha: 0 })

    const tl = gsap.timeline({ delay: 0.2 })

    // Title fades and rises
    tl.to(headingWrapperRef.current, {
      autoAlpha: 1,
      scale: 1,
      y: 0,
      duration: 1.2,
      ease: 'cinematic',
    })

    // Subtitle fades in
    tl.to(subtitleRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.6')

    // Scroll hint appears
    tl.to(scrollHintRef.current, {
      autoAlpha: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.3')

    // Scroll hint bounce loop
    gsap.to(scrollHintRef.current.querySelector('.scroll-arrow'), {
      y: 8,
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: 'power2.inOut',
      delay: 1.5,
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-section scene"
      role="region"
      aria-label="Hero"
    >
      {/* React Bits ColorBends Background */}
      {inView && (
        <div className="hero-canvas-wrapper" aria-hidden="true">
          <ColorBends
            rotation={90}
            speed={0.2}
            colors={["#5227FF", "#7C3AED", "#3B82F6"]}
            transparent
            autoRotate={1}
            scale={0.6}
            frequency={1.6}
            warpStrength={1}
            mouseInfluence={1.6}
            parallax={0.5}
            noise={0.2}
            iterations={1}
            intensity={1.5}
            bandWidth={6}
          />
        </div>
      )}

      {/* Vignette */}
      <div className="vignette" aria-hidden="true" />

      {/* Hero content */}
      <div className="hero-content">
        <div
          ref={headingWrapperRef}
          className="hero-heading-wrapper"
        >
          {/* SEO and FCP Friendly Text (visually hidden) */}
          <h1 className="sr-only">DHEERAJ</h1>
          <ParticleText
            text="DHEERAJ"
            particleSize={1.8}
            particleDensity={3}
            mouseRadius={110}
            returnSpeed={0.06}
            font={{
              fontWeight: '700',
              fontFamily: '"Quilon", "Cabinet Grotesk", sans-serif'
            }}
          />
        </div>
        <p ref={subtitleRef} className="hero-subtitle text-meta">
          {/* Video Editor&nbsp;&nbsp;/&nbsp;&nbsp;UGC Editor&nbsp;&nbsp;/&nbsp;&nbsp;Graphic Designer*/}
          Video Editor crafting scroll-stopping content for creators, brands, and businesses.
        </p>
      </div>

      {/* Scroll hint */}
      <div ref={scrollHintRef} className="scroll-hint" aria-hidden="true">
        <span className="scroll-hint-label text-meta">Scroll</span>
        <div className="scroll-arrow">
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M8 0V20M8 20L2 14M8 20L14 14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  )
}
