import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { projects } from '../../data/projects'
import VideoPlayer from './VideoPlayer'
import './Portfolio.css'

export default function Portfolio() {
  const sectionRef   = useRef<HTMLElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const section = sectionRef.current!
    const track   = trackRef.current!
    const slides  = track.querySelectorAll('.portfolio-slide')

    const mm = gsap.matchMedia()

    mm.add('(min-width: 901px)', () => {
      // Translate horizontal track
      const scrollTween = gsap.fromTo(track,
        { x: 0 },
        {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      )

      // Staggered reveals for project details in each slide
      slides.forEach((slide, i) => {
        const meta  = slide.querySelector('.slide-meta')  as HTMLElement
        const title = slide.querySelector('.slide-title') as HTMLElement

        if (i === 0) return // first is already visible

        gsap.from([meta, title], {
          y: 30,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            containerAnimation: scrollTween,
            trigger: slide,
            start: 'left 80%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    })

    mm.add('(max-width: 900px)', () => {
      // Baseline values for mobile - stack vertically
      gsap.set(track, { x: 0 })

      slides.forEach((slide) => {
        gsap.from(slide, {
          autoAlpha: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: slide,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        })
      })
    })

    return () => mm.revert()
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="cinematics"
      className="portfolio-section"
      role="region"
      aria-label="Cinematic Work"
    >
      {/* The pinned container */}
      <div ref={containerRef} className="portfolio-container">
        {/* Horizontal track that moves left */}
        <div ref={trackRef} className="portfolio-track">
          {projects.map((project, i) => (
            <div key={project.id} className="portfolio-slide">
              {/* Left: project metadata */}
              <div className="slide-meta">
                <span className="slide-eyebrow text-meta">Cinematics</span>
                <div className="slide-meta-grid">
                  <MetaItem label="Type"     value={project.category} />
                  <MetaItem label="Duration" value={project.duration}  />
                  <MetaItem label="Client"   value={project.client}    />
                  <MetaItem label="Year"     value={project.year}      />
                </div>
                <p className="slide-desc text-body-lg">{project.description}</p>
              </div>

              {/* Center: video */}
              <div className="slide-video">
                <VideoPlayer
                  src={project.videoSrc}
                  thumbnail={project.thumbnail}
                  title={project.title}
                />
              </div>

              {/* Right: index + title */}
              <div className="slide-title-col">
                <span className="slide-index text-meta">
                  {project.index} / {String(projects.length).padStart(2, '0')}
                </span>
                <h2 className="slide-title text-section-title">{project.title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="meta-item">
      <span className="meta-label text-meta">{label}</span>
      <span className="meta-value">{value}</span>
    </div>
  )
}
