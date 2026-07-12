import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '../../utils/gsapSetup'
import { useGSAP } from '@gsap/react'
import './Skills.css'

interface Skill {
  id: string
  title: string
  tag: string
  description: string
  interaction: string
}

const SKILLS: Skill[] = [
  { id: 'color', title: 'Color Grading', tag: 'DaVinci Resolve', description: 'Raw conversion, color spaces, matching cameras, skin tone matching, and aesthetic look design.', interaction: 'hue' },
  { id: 'motion', title: 'Motion Design', tag: 'After Effects', description: 'Kinetic subtitles, lower thirds, logo intros, HUD tracking, and visual FX compositing.', interaction: 'ripple' },
  { id: 'typography', title: 'Typography', tag: 'Text Hierarchy', description: 'Modern, high-retention animated captions, layout spacing, and readable title designs.', interaction: 'letters' },
  { id: 'story', title: 'Storytelling', tag: 'Pacing & Hooks', description: 'Creating high-retention narrative arcs, scripting hooks, and maintaining visual flow.', interaction: 'quote' },
  { id: 'sound', title: 'Sound Design', tag: 'Audio Foley', description: 'Immersive soundscapes, detailed foley effects, vocal cleaning, and beat mixing.', interaction: 'wave' },
  { id: 'composition', title: 'Composition', tag: 'Visual Balance', description: 'Rule of thirds, grid layouts, perspective correction, crop edits, and subject focus.', interaction: 'grid' },
  { id: 'pacing', title: 'Pacing', tag: 'Retention Rhythm', description: 'Beat cutting, fast-paced vertical cuts, speed ramps, and retention optimization.', interaction: 'speed' },
  { id: 'transitions', title: 'Transitions', tag: 'Seamless Cuts', description: 'Thematic whip pans, match cuts, mask wipes, zoom transitions, and audio-driven edits.', interaction: 'crossfade' },
  { id: 'vfx', title: 'Visual Effects', tag: 'Tracking & VFX', description: 'Chroma keying, roto brush masking, motion tracking, cleanup, and graphics overlays.', interaction: 'glitch' },
  { id: 'brand', title: 'Photo Editing', tag: 'Lightroom raw', description: 'Raw development, editorial color grades, wedding color matching, and image retouching.', interaction: 'bloom' },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useGSAP(() => {
    // Reveal text wrappers
    gsap.from('.skill-text-wrap', {
      y: 35,
      autoAlpha: 0,
      stagger: 0.05,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    })

    // Reveal divider lines
    gsap.fromTo('.skill-line',
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: 'power3.inOut',
        transformOrigin: 'left center',
        stagger: 0.06,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      }
    )
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="skills-section scene"
      role="region"
      aria-label="Skills"
    >
      <div className="skills-header">
        <span className="text-meta">Expertise</span>
        <h2 className="text-section-title">The Craft</h2>
      </div>

      <div className="skills-list">
        {SKILLS.map((skill, index) => {
          const isHovered = hoveredId === skill.id
          const hasAnyHover = hoveredId !== null
          const isDimmed = hasAnyHover && !isHovered

          // Micro-interaction animation parameters
          let textX = isHovered ? 12 : 0
          let textColor = isDimmed ? 'rgba(255,255,255,0.25)' : 'var(--color-text-primary)'
          let letterSpacing = 'normal'
          let skewX = 0
          let textShadow = 'none'
          let filter = 'none'

          if (isHovered) {
            textColor = 'var(--color-text-primary)'
            if (skill.interaction === 'hue') {
              filter = 'hue-rotate(120deg)'
              textColor = 'var(--color-accent-hover)'
            } else if (skill.interaction === 'letters') {
              letterSpacing = '0.04em'
            } else if (skill.interaction === 'speed') {
              letterSpacing = '-0.02em'
              skewX = -6
            } else if (skill.interaction === 'crossfade') {
              textColor = 'rgba(255, 255, 255, 0.75)'
            } else if (skill.interaction === 'bloom') {
              textShadow = '0 0 12px var(--color-accent)'
            } else if (skill.interaction === 'ripple') {
              textX = 20
            }
          }

          return (
            <div
              key={skill.id}
              className={`skill-item ${isHovered ? 'skill-active' : ''}`}
              data-cursor="text"
              onMouseEnter={() => setHoveredId(skill.id)}
              onMouseLeave={() => setHoveredId(null)}
              tabIndex={0}
            >
              {/* Grid background overlay for Composition */}
              {isHovered && skill.interaction === 'grid' && (
                <motion.div 
                  className="skill-grid-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Layout Wrapper */}
              <div className="skill-text-wrap">
                <motion.span 
                  className="skill-index text-meta"
                  animate={{ 
                    color: isHovered ? 'var(--color-text-primary)' : 'rgba(255,255,255,0.2)',
                    x: isHovered ? 4 : 0
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {String(index + 1).padStart(2, '0')}
                </motion.span>

                <motion.h3 
                  className={`skill-text ${isHovered && skill.interaction === 'glitch' ? 'glitch-active' : ''}`}
                  animate={{ 
                    x: textX,
                    color: textColor,
                    letterSpacing,
                    skewX,
                    textShadow,
                    filter
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {skill.title}
                </motion.h3>

                <div className="skill-extra-wrap">
                  {/* Storytelling Quote */}
                  {isHovered && skill.interaction === 'quote' && (
                    <motion.span 
                      className="skill-quote"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      "Every frame is a decision."
                    </motion.span>
                  )}

                  {/* Sound Design Waveform */}
                  {isHovered && skill.interaction === 'wave' && (
                    <div className="mini-waveform">
                      <span className="bar bar-1"></span>
                      <span className="bar bar-2"></span>
                      <span className="bar bar-3"></span>
                      <span className="bar bar-4"></span>
                      <span className="bar bar-5"></span>
                    </div>
                  )}

                  <motion.span 
                    className="skill-tag text-meta"
                    animate={{ 
                      opacity: isHovered ? 1 : 0.4,
                      x: isHovered ? -12 : 0,
                      color: isHovered ? 'var(--color-accent-hover)' : 'rgba(255,255,255,0.45)'
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    {skill.tag}
                  </motion.span>
                </div>
              </div>

              {/* Divider lines */}
              <div className="skill-line" />
              <motion.div 
                className="skill-line-glow"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHovered ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
