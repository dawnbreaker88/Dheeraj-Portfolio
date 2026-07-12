import { useEffect } from 'react'
import { motion, useAnimation, useMotionValue } from 'framer-motion'

export interface CircularSpinTextProps {
  text?: string
  spinDuration?: number
  onHover?: 'none' | 'slowDown' | 'speedUp' | 'pause' | 'goBonkers'
  size?: number
  fontSize?: number
  fontWeight?: number | string
  textColor?: string
  radius?: number
  letterSpacing?: number
  direction?: 'clockwise' | 'counterclockwise'
  showCircleBorder?: boolean
}

const getRotationTransition = (duration: number, from: number, direction: string, loop = true) => ({
  from,
  to: direction === "clockwise" ? from + 360 : from - 360,
  ease: "linear",
  duration,
  type: "tween" as const,
  repeat: loop ? Infinity : 0
})

const getTransition = (duration: number, from: number, direction: string) => ({
  rotate: getRotationTransition(duration, from, direction),
  scale: {
    type: "spring",
    damping: 20,
    stiffness: 300
  }
})

export default function CircularSpinText({
  text = "CONTACT ME • CONTACT ME • ",
  spinDuration = 12,
  onHover = "speedUp",
  size = 120,
  fontSize = 9,
  fontWeight = 800,
  textColor = "var(--color-accent)",
  radius = 42,
  letterSpacing = 1,
  direction = "clockwise",
  showCircleBorder = false
}: CircularSpinTextProps) {
  const letters = Array.from(text)
  const controls = useAnimation()
  const rotation = useMotionValue(0)

  useEffect(() => {
    const start = rotation.get()
    controls.start({
      rotate: direction === "clockwise" ? start + 360 : start - 360,
      scale: 1,
      transition: getTransition(spinDuration, start, direction)
    })
  }, [spinDuration, text, onHover, controls, direction])

  const handleHoverStart = () => {
    if (onHover === "none") return
    const start = rotation.get()
    
    if (onHover === "pause") {
      controls.start({
        rotate: start,
        scale: 1.05,
        transition: {
          rotate: { type: "spring", damping: 25, stiffness: 400 },
          scale: { type: "spring", damping: 20, stiffness: 300 }
        }
      })
      return
    }

    let transitionConfig
    let scaleVal = 1

    switch (onHover) {
      case "slowDown":
        transitionConfig = getTransition(spinDuration * 2, start, direction)
        break
      case "speedUp":
        transitionConfig = getTransition(spinDuration / 3, start, direction)
        break
      case "goBonkers":
        transitionConfig = getTransition(spinDuration / 10, start, direction)
        scaleVal = 0.85
        break
      default:
        transitionConfig = getTransition(spinDuration, start, direction)
    }

    controls.start({
      rotate: direction === "clockwise" ? start + 360 : start - 360,
      scale: scaleVal,
      transition: transitionConfig
    })
  }

  const handleHoverEnd = () => {
    if (onHover === "none") return
    const start = rotation.get()
    controls.start({
      rotate: direction === "clockwise" ? start + 360 : start - 360,
      scale: 1,
      transition: getTransition(spinDuration, start, direction)
    })
  }

  return (
    <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        style={{
          margin: "0 auto",
          borderRadius: "50%",
          width: size,
          position: "relative",
          height: size,
          fontWeight,
          color: textColor,
          textAlign: "center",
          transformOrigin: "50% 50%",
          rotate: rotation,
          backgroundColor: showCircleBorder ? "rgba(255, 255, 255, 0.03)" : "transparent",
          border: showCircleBorder ? "1px solid rgba(255, 255, 255, 0.05)" : "none"
        }}
        initial={{ rotate: 0 }}
        animate={controls}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
      >
        {letters.map((letter, i) => {
          const rotationDeg = (360 / letters.length) * i
          const angle = (rotationDeg * Math.PI) / 180
          const x = Math.sin(angle) * radius
          const y = -Math.cos(angle) * radius
          const transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotationDeg}deg)`
          
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                display: "inline-block",
                left: "50%",
                top: "50%",
                fontSize,
                letterSpacing,
                transform,
                userSelect: "none",
                fontFamily: "Satoshi, monospace",
                textTransform: "uppercase"
              }}
            >
              {letter}
            </span>
          )
        })}
      </motion.div>
    </div>
  )
}
