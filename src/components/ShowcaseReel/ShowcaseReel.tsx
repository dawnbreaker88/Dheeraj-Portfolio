import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../../utils/gsapSetup'
import './ShowcaseReel.css'

const SHOWCASE_VIDEO_URL =
  'https://res.cloudinary.com/syipnv4u/video/upload/v1791102875/showreel-compressed.mp4'

export default function ShowcaseReel() {
  const containerRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)

  const toggleAudio = () => {
    if (!videoRef.current) return
    const nextMuted = !isMuted
    videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  useGSAP(() => {
    const track = trackRef.current
    const frame = frameRef.current
    if (!track || !frame) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 769px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          pin: stickyRef.current,
          anticipatePin: 1,
        },
      })

      // Phase 1: Expand into Fullscreen smoothly
      tl.to(
        frame,
        {
          width: '100vw',
          height: '100vh',
          borderRadius: '0px',
          maxWidth: '100vw',
          ease: 'power2.out',
          duration: 1.0,
        },
        0
      )

      // Phase 2: Hook Fullscreen for an extended scroll hold so user can watch
      tl.to({}, { duration: 2.8 })

      // Phase 3: Exit / Settle into dock frame as user scrolls past
      tl.to(
        frame,
        {
          width: '84vw',
          height: '66vh',
          borderRadius: '16px',
          maxWidth: '1440px',
          ease: 'power2.inOut',
          duration: 1.2,
        }
      )
    })

    // Mobile / Tablet: Smooth responsive scale with comfortable hold
    mm.add('(max-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          pin: stickyRef.current,
        },
      })

      tl.to(frame, {
        width: '100vw',
        height: '92vh',
        borderRadius: '0px',
        ease: 'power2.out',
        duration: 1.0,
      }, 0)

      // Hold fullscreen on mobile
      tl.to({}, { duration: 2.2 })

      tl.to(frame, {
        width: '92vw',
        height: '62vh',
        borderRadius: '12px',
        ease: 'power2.inOut',
        duration: 1.0,
      })
    })

    return () => mm.revert()
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="showcase-reel"
      className="showcase-reel-section scene"
      aria-label="Showcase Reel"
    >
      <div ref={trackRef} className="showcase-reel-track">
        <div ref={stickyRef} className="showcase-reel-sticky">
        

          {/* Scalable cinematic video frame */}
          <div ref={frameRef} className="showcase-reel-frame">
            <div className="showcase-reel-glow" aria-hidden="true" />
            <div className="showcase-reel-grain" aria-hidden="true" />
            <div className="showcase-reel-vignette" aria-hidden="true" />

            <video
              ref={videoRef}
              className="showcase-reel-video"
              src={SHOWCASE_VIDEO_URL}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
            />

           

            <div className="showcase-reel-controls">
          

              <button
                type="button"
                className="showcase-reel-audio-btn"
                onClick={toggleAudio}
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              >
                {isMuted ? (
                  <>
                    <svg className="showcase-audio-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                    <span>Sound Off</span>
                  </>
                ) : (
                  <>
                    <svg className="showcase-audio-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span>Sound On</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
