import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from '../../utils/gsapSetup'
import { useGSAP } from '@gsap/react'
import './Experience.css'

const EXPERIENCE = [
  {
    id: 'e1',
    period: '2021',
    role: 'Started Editing',
    org: 'Personal Projects',
    deliverables: [
      'Learning video editing',
      'Personal edits',
      'Creative experiments',
    ],
  },
  {
    id: 'e2',
    period: '2023',
    role: 'Freelance Video Editor',
    org: 'Fiverr',
    deliverables: [
      'Short-form videos',
      'Client edits',
      'Content for creators',
    ],
  },
  {
    id: 'e3',
    period: '2024 – Present',
    role: 'Lead Video Editor',
    org: 'Click Cadets',
    deliverables: [
      'Event highlights',
      'Promotional videos',
      'Social media content',
    ],
  },
  {
    id: 'e4',
    period: '2024 – Present',
    role: 'Freelance Video Editor',
    org: 'Creators & Local Brands',
    deliverables: [
      'UGC ads',
      'Reels & Shorts',
      'Cinematic edits',
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useGSAP(() => {
    gsap.from('.exp-entry', {
      x: -40,
      autoAlpha: 0,
      stagger: { amount: 0.5 },
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    })
  }, { scope: sectionRef })

  const toggle = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="experience-section scene"
      role="region"
      aria-label="Experience"
    >
      <div className="experience-inner">
        <div className="experience-header">
          <span className="text-meta">Journey</span>
          <h2 className="text-section-title">Experience</h2>
          <p className="text-body-lg experience-subtitle">
            A chronological look at my editing path, working with individual creators and commercial partners.
          </p>
        </div>

        <motion.div layout="position" className="experience-timeline">
          {EXPERIENCE.map((exp, index) => {
            const isExpanded = expandedId === exp.id
            return (
              <motion.article
                key={exp.id}
                layout="position"
                className={`exp-entry ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggle(exp.id)}
                tabIndex={0}
                aria-expanded={isExpanded}
                onKeyDown={(e) => e.key === 'Enter' && toggle(exp.id)}
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              >
                <div className="exp-line-col" aria-hidden="true">
                  <motion.div 
                    className="exp-dot"
                    animate={{
                      scale: isExpanded ? 1.3 : 1,
                      borderColor: isExpanded ? 'var(--color-accent)' : 'rgba(255,255,255,0.25)',
                      backgroundColor: isExpanded ? 'var(--color-accent)' : 'transparent',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  {index < EXPERIENCE.length - 1 && (
                    <motion.div 
                      className="exp-connector"
                      animate={{
                        backgroundColor: isExpanded ? 'var(--color-accent)' : 'var(--color-border)',
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>

                <div className="exp-content">
                  <div className="exp-top">
                    <div className="exp-info">
                      <span className="exp-period text-meta">{exp.period}</span>
                      <h3 className="exp-role">{exp.role}</h3>
                      <span className="exp-org text-meta">{exp.org}</span>
                    </div>
                    <div className="exp-toggle" aria-hidden="true">
                      <motion.div
                        animate={{ rotate: isExpanded ? 45 : 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="exp-icon-wrap"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="deliverables"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: 'auto', 
                          opacity: 1,
                          transition: {
                            height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.3, delay: 0.1 }
                          }
                        }}
                        exit={{ 
                          height: 0, 
                          opacity: 0,
                          transition: {
                            height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.2 }
                          }
                        }}
                        style={{ overflow: 'hidden' }}
                        className="exp-deliverables"
                      >
                        <div className="exp-deliverables-inner">
                          <span className="text-meta exp-deliverables-title">Deliverables</span>
                          <ul className="deliverable-list">
                            {exp.deliverables.map((d) => (
                              <motion.li 
                                key={d}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.25 }}
                              >
                                {d}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

