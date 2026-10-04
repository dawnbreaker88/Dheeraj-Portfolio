import { useState, useRef, useEffect, useMemo } from 'react'
import { ugcProjects, ShortFormCategory } from '../../data/ugcProjects'
import CurvedCarousel from './CurvedCarousel'
import './Ugc.css'
import { gsap, useGSAP } from '../../utils/gsapSetup'

const CATEGORIES: ShortFormCategory[] = ['ALL', 'BRANDS', 'EVENTS', 'PODCASTS', 'UGC']

export default function Ugc() {
  const [activeCategory, setActiveCategory] = useState<ShortFormCategory>('ALL')
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const carouselColRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'ALL') return ugcProjects
    return ugcProjects.filter((p) => p.filterCategory === activeCategory)
  }, [activeCategory])

  const safeIndex = Math.min(activeIndex, Math.max(0, filteredProjects.length - 1))
  const activeProject = filteredProjects[safeIndex] || filteredProjects[0]

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle category switch with smooth layout-aware transition
  const handleCategoryChange = (category: ShortFormCategory) => {
    if (category === activeCategory) return
    setActiveCategory(category)
    setActiveIndex(0)

    if (carouselColRef.current && metaRef.current) {
      gsap.fromTo(
        [carouselColRef.current, metaRef.current],
        { opacity: 0.3, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      )
    }
  }

  // Smooth transition for metadata when active video changes
  useGSAP(() => {
    if (!metaRef.current) return

    gsap.fromTo(
      metaRef.current.children,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out', overwrite: 'auto' }
    )
  }, { dependencies: [activeProject?.id], scope: sectionRef })

  // Map filtered projects to CurvedCarousel items
  const carouselItems = useMemo(() => {
    return filteredProjects.map((p) => ({
      video: p.videoSrc || undefined,
      image: p.poster ? { src: p.poster, alt: p.title } : undefined,
      title: p.title,
      description: p.description,
    }))
  }, [filteredProjects])

  return (
    <section
      ref={sectionRef}
      id="short-form"
      className="ugc-section scene"
      aria-label="Short-Form Video Editing"
    >
      <div id="ugc" style={{ position: 'absolute', top: 0, left: 0 }} aria-hidden="true" />
      <div className="ugc-container">
        {/* Top Bar: Title & Category Pills */}
        <div className="ugc-top-bar">
          <div className="ugc-header-block">
            <span className="ugc-eyebrow">
              <span>02</span>
              <span>/</span>
              <span>Short-Form Portfolio</span>
            </span>
            <h2 className="ugc-section-title">Short-Form Editing</h2>
            <p className="ugc-section-desc">
              High-retention vertical narratives crafted for conversion, brand authority, and community engagement.
            </p>
          </div>

          <nav className="ugc-categories-nav" aria-label="Filter short-form projects by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`ugc-category-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat === 'ALL' ? 'All Formats' : cat}
              </button>
            ))}
          </nav>
        </div>

        {/* Content: Left Metadata + Right Curved Carousel */}
        <div className="ugc-content-grid">
          {/* Left Column: Metadata */}
          <div className="ugc-meta-col">
            {activeProject && (
              <div ref={metaRef} className="ugc-project-details">
                <div className="ugc-details-grid">
                  <div className="ugc-detail-item">
                    <span className="ugc-detail-label">Project</span>
                    <span className="ugc-detail-value">{activeProject.title}</span>
                  </div>
                  <div className="ugc-detail-item">
                    <span className="ugc-detail-label">Client / Brand</span>
                    <span className="ugc-detail-value">{activeProject.brand}</span>
                  </div>
                  <div className="ugc-detail-item">
                    <span className="ugc-detail-label">Format</span>
                    <span className="ugc-detail-value">{activeProject.category}</span>
                  </div>
                  <div className="ugc-detail-item">
                    <span className="ugc-detail-label">Pacing</span>
                    <span className="ugc-detail-value">{activeProject.duration}</span>
                  </div>
                </div>
                <p className="ugc-project-desc">{activeProject.description}</p>
              </div>
            )}
          </div>

          {/* Right Column: Carousel */}
          <div ref={carouselColRef} className="ugc-carousel-col">
            <div className="ugc-carousel-wrapper">
              <CurvedCarousel
                key={activeCategory}
                items={carouselItems}
                onActiveChange={(idx) => setActiveIndex(idx)}
                cardWidth={isMobile ? 180 : 260}
                cardHeight={isMobile ? 320 : 440}
                visibleCards={isMobile ? 3 : 5}
                radiusDepth={isMobile ? 160 : 380}
                verticalDip={isMobile ? 12 : 28}
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
                buttonSize={isMobile ? 32 : 42}
                buttonSideOffset={isMobile ? 6 : 12}
                videoAutoPlay={true}
                videoLoop={true}
                dynamicShadowDepth={1.2}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
