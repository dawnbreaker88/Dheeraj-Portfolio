import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import './Workflow.css'

interface Node {
  id: string
  label: string
  description: string
  angle: number
}

const NODES: Node[] = [
  { id: 'research', label: 'Research',  description: 'Understanding the brand, audience, and goal before a single frame is touched.', angle: 0 },
  { id: 'story',    label: 'Story',     description: 'Structuring a narrative arc that guides the viewer from hook to resolution.', angle: 45 },
  { id: 'assets',   label: 'Assets',    description: 'Organising footage, audio, and graphics for maximum creative flow.', angle: 90 },
  { id: 'edit',     label: 'Edit',      description: 'Cutting with rhythm and intention — pacing is everything.', angle: 135 },
  { id: 'sound',    label: 'Sound',     description: 'Sound design and music that amplify the emotional core.', angle: 180 },
  { id: 'color',    label: 'Color',     description: 'Color grading that sets mood and makes every frame feel intentional.', angle: 225 },
  { id: 'motion',   label: 'Motion',    description: 'Motion graphics and transitions that serve the story, not decorate it.', angle: 270 },
  { id: 'review',   label: 'Review',    description: 'Iterating with precision until the work speaks for itself.', angle: 315 },
]

const ORBIT_R = 160
const CENTER = 200

export default function Workflow() {
  const sectionRef = useRef<HTMLElement>(null)
  const orbitGroupRef = useRef<SVGGElement>(null)
  const lineRefs = useRef<Record<string, SVGLineElement | null>>({})
  const nodeRefs = useRef<Record<string, SVGGElement | null>>({})
  const [activeNode, setActiveNode] = useState<Node | null>(null)
  const rotationRef = useRef(0)

  useGSAP(() => {
    if (!orbitGroupRef.current) return

    // Slow continuous idle rotation
    const rotationTween = gsap.to(rotationRef, {
      current: 360,
      duration: 40,
      ease: 'none',
      repeat: -1,
      onUpdate() {
        if (orbitGroupRef.current) {
          orbitGroupRef.current.setAttribute(
            'transform',
            `rotate(${rotationRef.current} ${CENTER} ${CENTER})`
          )
        }
      },
    })

    // Entrance animation
    gsap.from(orbitGroupRef.current, {
      scale: 0.8,
      autoAlpha: 0,
      duration: 1.4,
      ease: 'cinematic',
      transformOrigin: `${CENTER}px ${CENTER}px`,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 65%',
        toggleActions: 'play none none none',
      },
    })

    // Pause/Resume continuous rotation when offscreen to conserve CPU
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        rotationTween.play()
      } else {
        rotationTween.pause()
      }
    }, { threshold: 0.05 })

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      observer.disconnect()
      rotationTween.kill()
    }
  }, { scope: sectionRef })

  const handleNodeHover = (node: Node) => {
    setActiveNode(node)
    const line = lineRefs.current[node.id]
    if (line) {
      gsap.fromTo(line,
        { strokeDashoffset: 1, strokeDasharray: 1 },
        { strokeDashoffset: 0, strokeDasharray: 1, duration: 0.6, ease: 'power2.out' }
      )
      gsap.to(line, { stroke: 'var(--color-accent)', opacity: 1, duration: 0.3 })
    }
    const ng = nodeRefs.current[node.id]
    if (ng) gsap.to(ng.querySelector('circle'), { r: 12, fill: 'var(--color-accent)', duration: 0.3 })
  }

  const handleNodeLeave = (node: Node) => {
    setActiveNode(null)
    const line = lineRefs.current[node.id]
    if (line) gsap.to(line, { stroke: 'rgba(255,255,255,0.1)', opacity: 0.4, duration: 0.4 })
    const ng = nodeRefs.current[node.id]
    if (ng) gsap.to(ng.querySelector('circle'), { r: 8, fill: '#1a1a2e', duration: 0.3 })
  }

  return (
    <section
      ref={sectionRef}
      id="workflow"
      className="workflow-section scene"
      aria-label="Creative Workflow"
    >
      <div className="workflow-inner">
        <div className="workflow-header">
          <span className="text-meta">Process</span>
          <h2 className="text-section-title workflow-title">
            Creative<br />Workflow
          </h2>
        </div>

        <div className="orbital-wrapper">
          <svg
            className="orbital-svg"
            viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
            aria-hidden="true"
          >
            {/* Orbit ring */}
            <circle
              cx={CENTER} cy={CENTER} r={ORBIT_R}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />

            <g ref={orbitGroupRef}>
              {/* Connection lines */}
              {NODES.map((node) => {
                const rad = (node.angle * Math.PI) / 180
                const nx = CENTER + ORBIT_R * Math.cos(rad)
                const ny = CENTER + ORBIT_R * Math.sin(rad)
                return (
                  <line
                    key={`line-${node.id}`}
                    ref={(el) => { lineRefs.current[node.id] = el }}
                    x1={CENTER} y1={CENTER}
                    x2={nx} y2={ny}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                )
              })}

              {/* Orbit nodes */}
              {NODES.map((node) => {
                const rad = (node.angle * Math.PI) / 180
                const nx = CENTER + ORBIT_R * Math.cos(rad)
                const ny = CENTER + ORBIT_R * Math.sin(rad)
                return (
                  <g
                    key={node.id}
                    ref={(el) => { nodeRefs.current[node.id] = el }}
                    transform={`translate(${nx}, ${ny})`}
                    style={{ cursor: 'none' }}
                    onMouseEnter={() => handleNodeHover(node)}
                    onMouseLeave={() => handleNodeLeave(node)}
                    tabIndex={0}
                    aria-label={node.label}
                    role="button"
                    data-cursor="text"
                  >
                    <circle r="8" fill="#1a1a2e" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                    {/* Counter-rotate label so it stays readable */}
                    <g transform={`rotate(${-rotationRef.current} 0 0)`}>
                      <text
                        x="0" y="28"
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.55)"
                        fontSize="9"
                        fontFamily="Outfit, sans-serif"
                        fontWeight="500"
                        letterSpacing="0.08em"
                        style={{ userSelect: 'none', textTransform: 'uppercase' }}
                      >
                        {node.label}
                      </text>
                    </g>
                  </g>
                )
              })}
            </g>

            {/* Center node */}
            <circle cx={CENTER} cy={CENTER} r="38" fill="#0d0d1a" stroke="rgba(106, 90, 249, 0.3)" strokeWidth="1" />
            <text
              x={CENTER} y={CENTER - 4}
              textAnchor="middle"
              fill="white"
              fontSize="10"
              fontFamily="Outfit, sans-serif"
              fontWeight="700"
              letterSpacing="0.06em"
            >
              FINAL
            </text>
            <text
              x={CENTER} y={CENTER + 10}
              textAnchor="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize="9"
              fontFamily="Outfit, sans-serif"
              letterSpacing="0.06em"
            >
              DELIVERY
            </text>
          </svg>

          {/* Active node description */}
          <div className={`node-tooltip ${activeNode ? 'visible' : ''}`}>
            {activeNode && (
              <>
                <span className="node-tooltip-label text-meta">{activeNode.label}</span>
                <p className="node-tooltip-desc">{activeNode.description}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
