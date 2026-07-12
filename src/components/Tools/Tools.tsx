import { useRef } from 'react'
import { gsap } from '../../utils/gsapSetup'
import { useGSAP } from '@gsap/react'
import './Tools.css'

const TOOLS = [
  {
    id: 'premiere', name: 'Premiere Pro',
    uses: 'Timeline Editing • Multicam • Audio Sync • Exporting',
    tag: 'PR',
  },
  {
    id: 'davinci', name: 'DaVinci Resolve',
    uses: 'Color Grading • Fusion VFX • Audio Mixing • Delivery',
    tag: 'DR',
  },
  {
    id: 'photoshop', name: 'Photoshop',
    uses: 'Retouching • Thumbnails • Masking • Compositing',
    tag: 'PS',
  },
  {
    id: 'lightroom', name: 'Lightroom',
    uses: 'Color Correction • Raw Processing • Presets • Retouching',
    tag: 'LR',
  },
  {
    id: 'capcut', name: 'CapCut',
    uses: 'Quick Edits • Mobile Formats • Transitions • UGC',
    tag: 'CC',
  },
  {
    id: 'canva', name: 'Canva',
    uses: 'Social Layouts • Mockups • Graphics • Templates',
    tag: 'CA',
  },
]

// Triple the list to create a seamless infinite scroll loop
const INFINITE_TOOLS = [...TOOLS, ...TOOLS, ...TOOLS]

export default function Tools() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const track = trackRef.current!

    // Autoplay marquee loop
    const tween = gsap.fromTo(track,
      { x: '0%' },
      {
        x: '-33.333%',
        duration: 20, // scroll speed
        ease: 'none',
        repeat: -1,
      }
    )

    // Pause on hover
    const onEnter = () => tween.pause()
    const onLeave = () => tween.play()

    track.addEventListener('mouseenter', onEnter)
    track.addEventListener('mouseleave', onLeave)

    return () => {
      track.removeEventListener('mouseenter', onEnter)
      track.removeEventListener('mouseleave', onLeave)
      tween.kill()
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="tools"
      className="tools-section"
      role="region"
      aria-label="Software and Tools"
    >
      <div className="tools-container">
        <div className="tools-header">
          <span className="text-meta">Toolkit</span>
          <h2 className="text-section-title">Creative Toolkit</h2>
          <p className="text-body-lg tools-sub">
            The tools I rely on to transform ideas into polished videos and visuals.
          </p>

        </div>
      </div>

      <div className="tools-marquee-container">
        <div ref={trackRef} className="tools-marquee-track">
          {INFINITE_TOOLS.map((tool, idx) => (
            <div
              key={`${tool.id}-${idx}`}
              className="tool-card-marquee glass-card"
              data-cursor="link"
            >
              <div className="tool-card-header">
                <span className="tool-card-tag">{tool.tag}</span>
              </div>

              <div className="tool-card-meta">
                <h3 className="tool-card-name">{tool.name}</h3>
                <p className="tool-card-uses">{tool.uses}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
