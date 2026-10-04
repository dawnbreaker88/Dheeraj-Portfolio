import { useRef } from 'react'
import { gsap } from '../../utils/gsapSetup'
import { useGSAP } from '@gsap/react'
import './Tools.css'

interface ToolItem {
  id: string
  name: string
  uses: string
 
  logo: string
}

const TOOLS: ToolItem[] = [
  {
    id: 'premiere',
    name: 'Premiere Pro',
    uses: 'Timeline Editing • Multicam • Audio Sync • Master 4K Delivery',
    logo: '/logos/adobe-premiere-pro-icon.svg',
  },
  {
    id: 'davinci',
    name: 'DaVinci Resolve',
    uses: 'Color Grading • Node Architecture • Fusion VFX • Fairlight Audio',
    logo: '/logos/DaVinci_Resolve_17_logo.svg',
  },
  {
    id: 'capcut',
    name: 'CapCut',
    uses: 'Quick Turnaround • Vertical Formats • Motion Effects • UGC',
    logo: '/logos/capcut-icon.svg',
  },
  {
    id: 'canva',
    name: 'Canva',
    uses: 'Social Layouts • Visual Mockups • Graphic Assets • Typography',
    logo: '/logos/canva-icon.svg',
  },
  {
    id: 'photoshop',
    name: 'Photoshop',
    uses: 'Editorial Retouching • Custom Thumbnails • Masking • Compositing',
    logo: '/logos/photoshop-icon.svg',
  },
  {
    id: 'lightroom',
    name: 'Lightroom',
    uses: 'Color Correction • RAW Processing • Custom Presets & LUTs',
    logo: '/logos/lightroom-icon.svg',
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
    const tween = gsap.fromTo(
      track,
      { x: '0%' },
      {
        x: '-33.333%',
        duration: 22,
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
            The software suite I rely on to transform raw footage into polished, high-retention stories.
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
                <div className="tool-logo-container">
                  <img
                    src={tool.logo}
                    alt={`${tool.name} logo`}
                    className="tool-card-logo"
                    loading="lazy"
                  />
                </div>
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
