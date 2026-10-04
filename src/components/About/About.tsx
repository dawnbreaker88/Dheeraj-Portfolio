import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../../utils/gsapSetup'
import './About.css'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLParagraphElement>(null)
  const bioRef = useRef<HTMLParagraphElement>(null)

  useGSAP(() => {
    if (!statementRef.current || !sectionRef.current) return

    // Split headline statement into words for scrub illumination
    const splitStatement = SplitText.create(statementRef.current, {
      type: 'words',
      wordsClass: 'about-statement-word',
    })

    gsap.set(splitStatement.words, { opacity: 0.2, filter: 'blur(2px)' })

    // Scrub word-by-word reveal tied to scroll
    gsap.to(splitStatement.words, {
      opacity: 1,
      filter: 'blur(0px)',
      stagger: { each: 0.06, from: 'start' },
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        end: 'center 40%',
        scrub: 0.8,
      },
    })

    // Bio paragraph smooth scrub brighten
    if (bioRef.current) {
      gsap.fromTo(
        bioRef.current,
        { opacity: 0.4, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bioRef.current,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 0.8,
          },
        }
      )
    }

    // Meta cards staggered reveal
    gsap.from('.about-meta-card', {
      y: 28,
      opacity: 0.2,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-compact-meta-grid',
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    })

    return () => {
      splitStatement.revert()
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-compact-section scene"
      role="region"
      aria-label="About Dheeraj"
    >
      <div className="about-ambient-glow" aria-hidden="true" />

      <div className="about-compact-container">
        {/* Header with live availability badge */}
        <div className="about-compact-header">
          <span className="about-compact-eyebrow">
            <span>01</span>
            <span>/</span>
            <span>About</span>
          </span>
          <h2 className="about-compact-name">Dheeraj Reddy</h2>
          <div className="about-compact-role">
            <span>Video Editor & Visual Storyteller</span>
         
          </div>
        </div>

        {/* Scroll-Revealed Interactive Statement */}
        <p
          ref={statementRef}
          className="about-compact-statement"
          data-cursor="text"
        >
          Every frame has a purpose.{' '}
          <em className="accent-phrase">Every story deserves to be remembered.</em>
        </p>

        {/* Supporting Narrative with Interactive Chips */}
        <p ref={bioRef} className="about-compact-bio">
          I craft high-retention{' '}
          <span className="about-highlight-tag">Short-Form Content</span>, high-conversion{' '}
          <span className="about-highlight-tag">Brand Campaigns</span>, and dynamic{' '}
          <span className="about-highlight-tag">Podcast Edits</span> for creators and agencies.
          Obsessed with precision rhythmic pacing, crisp dialogue cleanup, punchy sound design, and{' '}
          <span className="about-highlight-tag">DaVinci Color Grading</span> that transforms raw camera feeds into unforgettable visual experiences.
        </p>

        {/* Interactive Metadata Cards */}
     
      </div>
    </section>
  )
}
