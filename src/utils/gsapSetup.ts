import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

// Register all plugins once at app startup
gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  Flip,
  Observer,
  DrawSVGPlugin,
  CustomEase,
  useGSAP
)

// Project-wide defaults — slow, confident, cinematic
gsap.defaults({
  ease: 'power3.out',
  duration: 1.0,
})

// Custom ease for cinematic reveals
CustomEase.create('cinematic', '0.16, 1, 0.3, 1')

// Reduced motion: override all durations to near-zero
const mm = gsap.matchMedia()
mm.add('(prefers-reduced-motion: reduce)', () => {
  gsap.globalTimeline.timeScale(100)
})

export { gsap, ScrollTrigger, SplitText, Flip, Observer, DrawSVGPlugin, CustomEase, useGSAP }
