import { useRef, useEffect, useState } from 'react'
import { gsap, ScrollTrigger } from '../../utils/gsapSetup'
import './Services.css'

interface SecondaryBentoItem {
  id: string
  num: string
  title: string
  tag: string
  desc: string
  features: string[]
}

const SECONDARY_SERVICES: SecondaryBentoItem[] = [
  {
    id: 'b-short',
    num: '02',
    title: 'Short-Form & UGC',
    tag: 'Reels / TikTok / Shorts',
    desc: 'Retention-first vertical creatives engineered to hook viewers in the first 2 seconds with snappy pacing, motion typography, and sound effects.',
    features: ['Hook Optimization', 'Dynamic Subtitles', 'Sound Sync', 'Viral Pacing'],
  },
  {
    id: 'b-brand',
    num: '03',
    title: 'Brand Commercials',
    tag: 'Product & Social Ads',
    desc: 'High-converting promotional ads and product storytelling designed to build brand authority and drive customer action.',
    features: ['Speed Ramps', 'Product Showcase', 'Visual Effects', 'Commercial Pacing'],
  },
  {
    id: 'b-podcast',
    num: '04',
    title: 'Podcast & Multi-Cam',
    tag: 'Interviews & Shows',
    desc: 'Multi-camera audio/video synchronization, natural conversational pacing, noise elimination, and bite-sized social highlights.',
    features: ['Multi-Cam Switching', 'Crisp Dialogue Polish', 'B-Roll Cutaways', 'Viral Snippets'],
  },
  {
    id: 'b-photo',
    num: '05',
    title: 'Photo Retouching',
    tag: 'Color & Editorial',
    desc: 'Professional editorial color correction, skin smoothing, mood-specific tone curves, and high-resolution master delivery.',
    features: ['Lightroom Custom LUTs', 'Tone Balancing', 'Texture Preservation'],
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeCardId, setActiveCardId] = useState<string | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const grid = gridRef.current
    if (!section || !grid) return

    ScrollTrigger.refresh()

    const cards = grid.querySelectorAll<HTMLElement>('.bento-card')
    const ctx = gsap.context(() => {
      // Entrance stagger
      gsap.from(cards, {
        y: 25,
        opacity: 0.3,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      // Mobile / tablet scroll reveal: smoothly reveals card content when scrolled into active view
      const mm = gsap.matchMedia()
      mm.add('(max-width: 900px)', () => {
        cards.forEach((card) => {
          ScrollTrigger.create({
            trigger: card,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleClass: 'is-in-view',
          })
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const handleCardClick = (id: string) => {
    setActiveCardId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      ref={sectionRef}
      id="services"
      className="services-bento-section scene"
      role="region"
      aria-label="Core Services"
    >
      <div className="services-bento-container">
        {/* Header */}
        <div className="services-bento-header">
          <span className="services-bento-eyebrow">
            <span>05</span>
            <span>/</span>
            <span>Capabilities</span>
          </span>
          <h2 className="services-bento-title">Core Services</h2>
          <p className="services-bento-sub">
            Targeted formats designed to maximize retention, viewership, and brand conversion across every screen.
          </p>
        </div>

        {/* Bento Grid: 1 Hero Main Card (Left) + 4 Balanced Cards (Right 2x2) */}
        <div ref={gridRef} className="services-bento-grid">
          {/* ── MAIN HERO CARD: VIDEO EDITING ── */}
          <article
            className={`bento-card bento-main-hero ${activeCardId === 'b-main' ? 'is-active' : ''}`}
            data-cursor="link"
            onClick={() => handleCardClick('b-main')}
          >
            <div className="bento-glow" aria-hidden="true" />

            <div className="bento-card-inner">
              <div className="bento-card-header">
                <span className="bento-card-num">01 / CORE</span>
                <span className="bento-expand-icon" aria-hidden="true">+</span>
              </div>

              <div className="bento-card-title-wrap">
                <h3 className="bento-hero-headline">Full-Cycle Video Editing</h3>
              </div>

              {/* Expandable Content (Revealed on Hover or Mobile Scroll) */}
              <div className="bento-expandable-wrapper">
                <div className="bento-expandable-inner">
                  <div className="bento-revealed-header">
                    <span className="bento-hero-badge">PRIMARY CRAFT</span>
                  </div>

                  <p className="bento-hero-desc">
                    From rough assembly to 4K master delivery. Structured narrative pacing, seamless chapter
                    transitions, precision audio cleanup, and bespoke sound design that keeps viewers glued to the screen.
                  </p>

                  {/* Workflow breakdown */}
                  <div className="bento-hero-pipeline">
                    <div className="bento-pipeline-step">
                      <span className="pipeline-step-num">1</span>
                      <span>Assembly & Narrative Arc Architecture</span>
                    </div>
                    <div className="bento-pipeline-step">
                      <span className="pipeline-step-num">2</span>
                      <span>Pacing Calibration, Speed Ramps & Transitions</span>
                    </div>
                    <div className="bento-pipeline-step">
                      <span className="pipeline-step-num">3</span>
                      <span>Multi-Layer Sound Design & Foley Integration</span>
                    </div>
                    <div className="bento-pipeline-step">
                      <span className="pipeline-step-num">4</span>
                      <span>DaVinci Studio Color Grade & 4K Master Delivery</span>
                    </div>
                  </div>

                  <div className="bento-features">
                    <span className="bento-chip">Premiere Pro</span>
                    <span className="bento-chip">DaVinci Resolve</span>
                    <span className="bento-chip">Sound Design & SFX</span>
                    <span className="bento-chip">4K Master Export</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ── 4 SECONDARY CARDS (2x2 Grid) ── */}
          {SECONDARY_SERVICES.map((svc) => (
            <article
              key={svc.id}
              className={`bento-card bento-col-secondary ${activeCardId === svc.id ? 'is-active' : ''}`}
              data-cursor="link"
              onClick={() => handleCardClick(svc.id)}
            >
              <div className="bento-glow" aria-hidden="true" />

              <div className="bento-card-inner">
                <div className="bento-card-header">
                  <span className="bento-card-num">{svc.num}</span>
                  <span className="bento-expand-icon" aria-hidden="true">+</span>
                </div>

                <div className="bento-card-title-wrap">
                  <h3 className="bento-card-title">{svc.title}</h3>
                </div>

                {/* Expandable Content (Revealed on Hover or Mobile Scroll) */}
                <div className="bento-expandable-wrapper">
                  <div className="bento-expandable-inner">
                    <div className="bento-revealed-header">
                      <span className="bento-tag">{svc.tag}</span>
                    </div>

                    <p className="bento-card-desc">{svc.desc}</p>

                    <div className="bento-features">
                      {svc.features.map((feat) => (
                        <span key={feat} className="bento-chip">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
