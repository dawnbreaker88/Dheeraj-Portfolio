import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { getCloudinaryUrl } from '../../utils/cloudinary'
import './About.css'

const PORTRAIT_PLACEHOLDER =
  getCloudinaryUrl("https://res.cloudinary.com/jqfy1wun/image/upload/v1786548800/WhatsApp_Image_2026-07-12_at_3.55.07_PM.jpg", { width: 800 })

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!textRef.current || !imageRef.current) return

    // Split text into words for staggered scroll reveal
    const split = SplitText.create(textRef.current, {
      type: 'words',
      wordsClass: 'about-word',
    })

    gsap.set(split.words, { opacity: 0.35 })

    // Scrub-driven word brightening
    gsap.to(split.words, {
      opacity: 1,
      stagger: { each: 0.1, from: 'start' },
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
        end: 'center 30%',
        scrub: 1.5,
      },
    })

    // Portrait entrance
    gsap.from(imageRef.current, {
      x: 80,
      autoAlpha: 0,
      duration: 1.4,
      ease: 'cinematic',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    })


    // Bio paragraph entrance
    gsap.from('.about-bio', {
      y: 24,
      autoAlpha: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
        toggleActions: 'play none none none',
      },
    })

    return () => split.revert()
  }, { scope: sectionRef })

  // Mouse tilt on portrait
  useEffect(() => {
    const img = imageRef.current
    if (!img) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = img.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      gsap.to(img, {
        rotationY: dx * 8,
        rotationX: -dy * 5,
        duration: 0.6,
        ease: 'power2.out',
        transformPerspective: 600,
      })
    }

    const handleMouseLeave = () => {
      gsap.to(img, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'power3.out' })
    }

    img.addEventListener('mousemove', handleMouseMove)
    img.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      img.removeEventListener('mousemove', handleMouseMove)
      img.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section scene"
      role="region"
      aria-label="Introduction"
    >
      <div className="about-grid">
        {/* Left: Typography */}
        <div className="about-text-col">
          <span className="text-meta about-eyebrow">About</span>
          <p
            ref={textRef}
            className="about-statement text-quote"
            data-cursor="text"
          >
            Every frame has a purpose.{' '}
            <em className="accent-word">Every story deserves to be remembered.</em>
          </p>

          <p className="text-body-lg about-bio">
            I started editing out of curiosity, and it quickly became what I love to do.
            From leading edits for my college media club to working with creators and
            local brands, I create <span className="accent-word">UGC ads</span>,
            <span className="accent-word"> short-form videos</span>,
            <span className="accent-word"> cinematic edits</span>, and
            <span className="accent-word"> photo edits</span> with clean pacing,
            thoughtful color, and attention to every detail.
          </p>
        </div>

        {/* Right: Portrait */}
        <div className="about-image-col">
          <div ref={imageRef} className="portrait-wrapper glass-card" style={{ transformStyle: 'preserve-3d' }}>
            <img
              src={PORTRAIT_PLACEHOLDER}
              alt="Dheeraj — Video Editor and Motion Designer"
              className="portrait-img"
              width={400}
              height={500}
            />
            {/* Glow behind portrait */}
            <div className="portrait-glow" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
