import { useState, useRef } from 'react'
import { ugcProjects } from '../../data/ugcProjects'
import CurvedCarousel from './CurvedCarousel'
import './Ugc.css'
import { gsap, ScrollTrigger, useGSAP } from '../../utils/gsapSetup'

export default function Ugc() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeProject = ugcProjects[activeIndex]
  
  const sectionRef = useRef<HTMLElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)

  // Pin section to create a slight pause on scroll
  useGSAP(() => {
    if (!sectionRef.current) return

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=400',
      pin: true,
      pinSpacing: true,
    })
  }, { scope: sectionRef })

  // Smooth transition for metadata when active video changes
  useGSAP(() => {
    if (!metaRef.current) return
    
    gsap.fromTo(metaRef.current.children, 
      { autoAlpha: 0, y: 15 },
      { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', overwrite: 'auto' }
    )
  }, { dependencies: [activeIndex], scope: sectionRef })

  // Map ugcProjects to the CurvedCarouselItem shape
  const carouselItems = ugcProjects.map(p => ({
    video: p.videoSrc || undefined,
    image: p.poster ? { src: p.poster, alt: p.title } : undefined,
    title: p.title,
    description: p.description,
  }))

  return (
    <section
      ref={sectionRef}
      id="ugc"
      className="ugc-section scene"
      aria-label="UGC Video Editing"
    >
      <div className="vignette" aria-hidden="true" />
      
      <div className="ugc-container">
        {/* Left Column: Metadata */}
        <div className="ugc-meta-col">
          <div className="ugc-header">
            <span className="text-meta ugc-eyebrow">User Generated Content</span>
            <h2 className="text-section-title ugc-section-title">UGC Edits</h2>
            <p className="ugc-section-desc text-body-lg">
              Authentic, platform-native vertical creatives engineered to capture attention, maximize retention, and drive brand conversions.
            </p>
          </div>

          <div ref={metaRef} className="ugc-project-details">
            <div className="ugc-details-grid">
              <div className="ugc-detail-item">
                <span className="ugc-detail-label text-meta">Project</span>
                <span className="ugc-detail-value">{activeProject.title}</span>
              </div>
              <div className="ugc-detail-item">
                <span className="ugc-detail-label text-meta">Brand</span>
                <span className="ugc-detail-value">{activeProject.brand}</span>
              </div>
              <div className="ugc-detail-item">
                <span className="ugc-detail-label text-meta">Format</span>
                <span className="ugc-detail-value">{activeProject.category}</span>
              </div>
              <div className="ugc-detail-item">
                <span className="ugc-detail-label text-meta">Duration</span>
                <span className="ugc-detail-value">{activeProject.duration}</span>
              </div>
            </div>
            <p className="ugc-project-desc text-body-lg">
              {activeProject.description}
            </p>
          </div>
        </div>

        {/* Right Column: Curved Carousel */}
        <div className="ugc-carousel-col">
          <div className="ugc-carousel-wrapper">
            <CurvedCarousel
              items={carouselItems}
              onActiveChange={(idx) => setActiveIndex(idx)}
              cardWidth={260}
              cardHeight={440}
              visibleCards={5}
              radiusDepth={380}
              verticalDip={28}
              animationStiffness={220}
              animationDamping={28}
              removeBackground={true}
              cardBackgroundColor="#0e0e11"
              cardBorderRadius={16}
              imageHeightPercent={75}
              showContentOnHover={true}
              showDots={true}
              buttonColor="rgba(255,255,255,0.08)"
              buttonHoverColor="rgba(255,255,255,0.18)"
              buttonArrowColor="#ffffff"
              buttonSize={42}
              buttonSideOffset={12}
              videoAutoPlay={true}
              videoLoop={true}
              dynamicShadowDepth={1.2}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

