import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import './Philosophy.css'

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null)
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useGSAP(() => {
    if (!quoteRef.current) return

    const split = SplitText.create(quoteRef.current, {
      type: 'words',
      wordsClass: 'phil-word',
    })

    gsap.set(split.words, { autoAlpha: 0, y: 30 })

    gsap.to(split.words, {
      autoAlpha: 1,
      y: 0,
      stagger: { each: 0.07, from: 'start' },
      ease: 'cinematic',
      duration: 1.0,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
        toggleActions: 'play none none none',
      },
    })

    return () => split.revert()
  }, { scope: sectionRef })

  // Canvas ripple on mousemove
  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const ripples: Array<{ x: number; y: number; r: number; alpha: number }> = []
    let animId: number

    const resize = () => {
      canvas.width = section.offsetWidth
      canvas.height = section.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let isDrawing = false

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        r: 0,
        alpha: 0.15,
      })

      if (!isDrawing) {
        isDrawing = true
        draw()
      }
    }

    section.addEventListener('mousemove', onMouseMove)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (ripples.length === 0) {
        isDrawing = false
        return
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]
        rp.r += 2.5
        rp.alpha -= 0.003
        if (rp.alpha <= 0) { ripples.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 51, 75, ${rp.alpha})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
      animId = requestAnimationFrame(draw)
    }

    return () => {
      window.removeEventListener('resize', resize)
      section.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="philosophy-section scene"
      role="region"
      aria-label="Editing Philosophy"
    >
      {/* Ripple canvas */}
      <canvas ref={canvasRef} className="ripple-canvas" aria-hidden="true" />

      <div className="vignette" aria-hidden="true" />

      <div className="philosophy-content">
        <span className="text-meta philosophy-eyebrow">Philosophy</span>
        <blockquote
          ref={quoteRef}
          className="text-quote philosophy-quote"
          data-cursor="text"
        >
          Every second matters.{' '}
          <em className="philosophy-accent">Every frame should have a reason.</em>
        </blockquote>
      </div>
    </section>
  )
}
