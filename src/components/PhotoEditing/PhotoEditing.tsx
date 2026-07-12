import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../utils/gsapSetup'
import PhantomInfiniteGallery from './PhantomInfiniteGallery'
import './PhotoEditing.css'

const GALLERY_ITEMS = [
  { title: "Wedding", image: { src: "https://res.cloudinary.com/ady5ycld/image/upload/v1783849912/DSC09658_v36xj1.jpg", alt: "Neon Portrait" }, year: 2025 },
  { title: "", image: { src: "https://res.cloudinary.com/ady5ycld/image/upload/v1783846367/IMG_2537.JPG_mqrwbx.jpg", alt: "Cyberpunk Streets" }, year: 2025 },
  { title: "Sunset Drift", image: { src: "https://res.cloudinary.com/ady5ycld/image/upload/v1783846367/IMG_2530.JPG_wpp0vd.jpg", alt: "Sunset Horizon" }, year: 2024 },
  { title: "Warm Film", image: { src: "https://res.cloudinary.com/ady5ycld/image/upload/v1783846366/IMG_2522.JPG_q1iiso.jpg", alt: "Warm Retro" }, year: 2024 },
  { title: "Cold Nordic", image: { src: "https://res.cloudinary.com/ady5ycld/image/upload/v1783846366/IMG_2520.JPG_apzvwz.jpg", alt: "Iceland Landscape" }, year: 2025 },
  { title: "Golden Gate", image: { src: "https://res.cloudinary.com/ady5ycld/image/upload/v1783846365/WhatsApp_Image_2026-07-12_at_2.12.44_PM_wggtum.jpg", alt: "Golden Gate Grade" }, year: 2024 },
  { title: "Product Detail", image: { src: "https://res.cloudinary.com/ady5ycld/image/upload/v1783849912/DSC09675_n9odpn.jpg", alt: "Headphone Shoot" }, year: 2024 },
  { title: "Editorial Light", image: { src: "https://res.cloudinary.com/ady5ycld/image/upload/v1783849912/DSC09670_xnm6ll.jpg", alt: "Editorial Lights" }, year: 2024 }
]

export default function PhotoEditing() {
  const sectionRef = useRef<HTMLElement>(null)
  const hudRef = useRef<HTMLDivElement>(null)

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

    // HUD entry animation
    if (hudRef.current) {
      gsap.fromTo(hudRef.current,
        { autoAlpha: 0, x: -30 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="photo-editing"
      className="photos-section scene"
      role="region"
      aria-label="Photo Editing Portfolio"
    >
      {/* Background Interactive 3D infinite gallery */}
      <div className="photos-gallery-canvas">
        <PhantomInfiniteGallery
          items={GALLERY_ITEMS}
          cellSize={210}
          gap={14}
          backgroundColor="transparent"
          textColor="rgba(255,255,255,0.6)"
          hoverColor="var(--color-accent)"
          zoomValue={0.65}
          arcAmount={0.7}
          arcMaxAngleDeg={26}
          edgeFade={0.3}
          parallaxStrength={0.12}
        />
      </div>

      {/* Floating Glassmorphic HUD overlay */}
      <div ref={hudRef} className="photos-hud glass-card">
        <span className="text-meta photos-hud-eyebrow">Photo Editing</span>
        <h2 className="photos-hud-title font-display">Beyond the Camera</h2>
        <p className="photos-hud-desc text-body-lg">
          Thoughtful color correction, natural retouching, and polished edits that bring every photo to life without losing its authenticity.
        </p>
        <div className="photos-hud-hints">
          <div className="hint-item">
            <span className="hint-bullet">•</span>
            <span className="hint-text">GRAB & DRAG TO DISCOVER</span>
          </div>
          <div className="hint-item">
            <span className="hint-bullet">•</span>
            <span className="hint-text">SWIPE TO THROW GRID</span>
          </div>
          <div className="hint-item">
            <span className="hint-bullet">•</span>
            <span className="hint-text">HOLD CLICK TO ZOOM OUT</span>
          </div>
        </div>
      </div>
    </section>
  )
}
