import { useRef } from 'react'
import { gsap, ScrollTrigger } from '../../utils/gsapSetup'
import { useGSAP } from '@gsap/react'
import './Services.css'

const SERVICES = [
  {
    id: 's1',
    num: '01',
    title: 'Short Form Editing',
    desc: 'Instagram Reels and YouTube Shorts edited with fast pacing, clean cuts, captions, and motion that keep viewers watching.',
  },
  {
    id: 's2',
    num: '02',
    title: 'Cinematic Editing',
    desc: 'Travel films, lifestyle edits, personal stories, and promotional videos with polished pacing, sound design, and color grading.',
  },
  {
    id: 's3',
    num: '03',
    title: 'Long Form',
    desc: 'Polished YouTube videos and docs designed with structured pacing, clear chapter transitions, and sound design.',
  },
  {
    id: 's4',
num: '04',
title: 'Podcast Editing',
desc: 'Clean, engaging podcast edits with natural pacing, crisp dialogue, and polished visuals that keep conversations flowing.',
  },
  {
    id: 's5',
    num: '05',
    title: 'Photo Editing',
    desc: 'Professional color correction, Lightroom grading, retouching, wedding edits, portraits, and social media-ready imagery.',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const section = sectionRef.current!
    const cards = cardsRef.current!.querySelectorAll('.service-card-stack')

    const mm = gsap.matchMedia()

    mm.add('(min-width: 901px)', () => {
      // Create a timeline linked to ScrollTrigger pinning
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * (SERVICES.length)}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      })

      // Setup initial state: first card is in center, others start stacked off-screen at bottom
      cards.forEach((card, i) => {
        if (i > 0) {
          gsap.set(card, {
            yPercent: 120,
            scale: 0.9,
            transformOrigin: 'top center',
          })
        }
      })

      // Sequence card animations:
      // As each card comes up, the previous cards shift up and scale down slightly to look like a deck.
      cards.forEach((card, i) => {
        if (i === 0) return

        // Preceding cards
        for (let prevIdx = 0; prevIdx < i; prevIdx++) {
          const prevCard = cards[prevIdx]
          const layersRemaining = i - prevIdx

          tl.to(prevCard, {
            yPercent: -10 * layersRemaining,
            scale: 1 - 0.05 * layersRemaining,
            opacity: 1 - 0.15 * layersRemaining,
            duration: 1,
            ease: 'none',
          }, `card-${i}`)
        }

        // Current card slides up
        tl.to(card, {
          yPercent: 0,
          scale: 1,
          duration: 1,
          ease: 'none',
        }, `card-${i}`)
      })
    })

    mm.add('(max-width: 900px)', () => {
      // Static baseline on mobile — scroll normally
      gsap.set(cards, {
        yPercent: 0,
        scale: 1,
        opacity: 1,
        clearProps: 'transform,opacity'
      })
    })

    return () => mm.revert()
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="services"
      className="services-section-pin"
      role="region"
      aria-label="Services"
    >
      <div ref={containerRef} className="services-stack-container">
        {/* Left column: Sticky info */}
        <div className="services-stack-info">
          <span className="text-meta">Core Services</span>
          <h2 className="text-section-title services-stack-title">
            Crafting Digital Stories
          </h2>
          <p className="text-body-lg services-stack-sub">
            Targeted formats designed to maximize retention, views, and brand conversion.
          </p>
        </div>

        {/* Right column: Stacked cards */}
        <div ref={cardsRef} className="services-cards-stack-wrapper">
          {SERVICES.map((svc) => (
            <article
              key={svc.id}
              className="service-card-stack glass-card"
            >
              <div className="card-stack-header">
                <span className="card-stack-num">{svc.num}</span>
                <h3 className="card-stack-title">{svc.title}</h3>
              </div>
              <p className="card-stack-desc">{svc.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
