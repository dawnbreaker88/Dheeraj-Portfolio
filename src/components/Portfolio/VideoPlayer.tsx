import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import './VideoPlayer.css'

interface VideoPlayerProps {
  src: string
  thumbnail: string
  title: string
}

const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='480'%3E%3Crect width='800' height='480' fill='%23111'/%3E%3Ccircle cx='400' cy='240' r='48' fill='none' stroke='%23333' stroke-width='2'/%3E%3Cpolygon points='388,220 428,240 388,260' fill='%23444'/%3E%3Ctext x='50%25' y='88%25' text-anchor='middle' fill='%23333' font-size='14' font-family='Outfit'%3EVideo Placeholder%3C/text%3E%3C/svg%3E`

export default function VideoPlayer({ src, thumbnail, title }: VideoPlayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Reveal controls on hover
  useEffect(() => {
    const wrapper = wrapperRef.current
    const controls = controlsRef.current
    if (!wrapper || !controls) return

    const showControls = () => gsap.to(controls, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' })
    const hideControls = () => gsap.to(controls, { autoAlpha: 0, y: 10, duration: 0.3, ease: 'power2.in' })

    wrapper.addEventListener('mouseenter', showControls)
    wrapper.addEventListener('mouseleave', hideControls)
    return () => {
      wrapper.removeEventListener('mouseenter', showControls)
      wrapper.removeEventListener('mouseleave', hideControls)
    }
  }, [])

  // Update progress bar
  useEffect(() => {
    const video = videoRef.current
    const fill = fillRef.current
    if (!video || !fill) return

    const onTimeUpdate = () => {
      const pct = video.duration ? (video.currentTime / video.duration) * 100 : 0
      fill.style.width = `${pct}%`
    }

    video.addEventListener('timeupdate', onTimeUpdate)
    return () => video.removeEventListener('timeupdate', onTimeUpdate)
  }, [])

  // Intelligent progressive preloading and play observations
  useEffect(() => {
    const video = videoRef.current
    const wrapper = wrapperRef.current
    if (!video || !wrapper) return

    // Generous Preloader Observer: starts buffering when nearby
    const preloadObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.preload = 'auto' // Instruct browser to load video data ahead
        preloadObserver.disconnect() // Run once
      }
    }, {
      rootMargin: '400px 800px 400px 800px' // Generous threshold to load ahead of scroll
    })

    // Strict Play/Pause Viewport Observer: plays when in view, pauses when out
    const playObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().then(() => {
          setIsPlaying(true)
        }).catch(() => {})
      } else {
        video.pause()
        setIsPlaying(false)
      }
    }, {
      rootMargin: '0px',
      threshold: 0.1
    })

    preloadObserver.observe(wrapper)
    playObserver.observe(wrapper)

    return () => {
      preloadObserver.disconnect()
      playObserver.disconnect()
    }
  }, [])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play().then(() => setIsPlaying(true)) }
    else { v.pause(); setIsPlaying(false) }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setIsMuted(v.muted)
  }

  const toggleFullscreen = () => {
    const w = wrapperRef.current
    if (!w) return
    if (!document.fullscreenElement) {
      w.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current
    const bar = progressRef.current
    if (!v || !bar || !v.duration) return
    const rect = bar.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    v.currentTime = pct * v.duration
  }

  return (
    <div
      ref={wrapperRef}
      className="video-player-wrapper"
      data-cursor="video"
    >
      {/* Video or placeholder */}
      {src ? (
        <video
          ref={videoRef}
          src={src}
          poster={thumbnail || PLACEHOLDER_SVG}
          className="video-element"
          muted
          playsInline
          loop
          preload="none"
        />
      ) : (
        <div className="video-placeholder">
          <img
            src={thumbnail || PLACEHOLDER_SVG}
            alt={`${title} — video thumbnail`}
            className="video-thumb"
          />
          <div className="placeholder-overlay">
            <div className="placeholder-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="23" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
                <polygon points="20,16 36,24 20,32" fill="rgba(255,255,255,0.7)"/>
              </svg>
            </div>
            <p className="placeholder-label text-meta">Video coming soon</p>
          </div>
        </div>
      )}

      {/* Custom controls */}
      <div ref={controlsRef} className="video-controls" aria-label="Video controls">
        {/* Progress bar */}
        <div ref={progressRef} className="video-progress" onClick={seek} role="slider" aria-label="Video progress">
          <div className="video-progress-track">
            <div ref={fillRef} className="video-progress-fill" />
          </div>
        </div>

        <div className="video-controls-row">
          {/* Play/Pause */}
          <button
            className="ctrl-btn"
            onClick={togglePlay}
            data-cursor="button"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="3" y="2" width="4" height="14" rx="1" fill="white"/>
                <rect x="11" y="2" width="4" height="14" rx="1" fill="white"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <polygon points="4,2 16,9 4,16" fill="white"/>
              </svg>
            )}
          </button>

          <div className="ctrl-spacer" />

          {/* Mute */}
          <button className="ctrl-btn" onClick={toggleMute} data-cursor="button" aria-label="Toggle mute">
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 6H1v6h3l5 4V2L4 6z" fill="white"/>
                <line x1="14" y1="6" x2="18" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="18" y1="6" x2="14" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 6H1v6h3l5 4V2L4 6z" fill="white"/>
                <path d="M13 5c2 1.2 2 6.8 0 8M11 7c.8.6.8 3.4 0 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          {/* Fullscreen */}
          <button className="ctrl-btn" onClick={toggleFullscreen} data-cursor="button" aria-label="Toggle fullscreen">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              {isFullscreen ? (
                <path d="M7 1v6H1M11 1v6h6M7 17v-6H1M11 17v-6h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              ) : (
                <path d="M1 7V1h6M17 7V1h-6M1 11v6h6M17 11v6h-6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
