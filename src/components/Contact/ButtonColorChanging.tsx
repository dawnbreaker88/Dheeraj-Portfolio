import { useState } from 'react'

export interface ButtonColorChangingProps {
  label?: string
  bgColor?: string
  accentColor?: string
  borderRadius?: number
  link?: string
  style?: React.CSSProperties
}

export default function ButtonColorChanging({
  label = "Start a Project",
  bgColor = "rgba(255, 255, 255, 0.03)",
  accentColor = "var(--color-accent)",
  borderRadius = 30,
  link = "",
  style
}: ButtonColorChangingProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const handleClick = () => {
    if (!link) return
    const isExternal = link.startsWith("http://") || link.startsWith("https://") || link.startsWith("mailto:") || link.startsWith("tel:");
    if (isExternal) {
      window.open(link, "_blank", "noopener noreferrer")
    } else {
      window.location.href = link
    }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setPressed(false)
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onClick={handleClick}
      style={{
        width: 310,
        height: 62,
        position: "relative",
        cursor: "pointer", // standard site custom cursor overrides
        transform: pressed ? "scale(0.97)" : "scale(1)",
        transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: "auto",
        ...style
      }}
    >
      <div
        style={{
          background: bgColor,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius,
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Expanding colored circle */}
        <div
          style={{
            position: "absolute",
            left: hovered ? -60 : -19,
            top: "50%",
            width: hovered ? 420 : 19,
            height: hovered ? 420 : 19,
            marginTop: hovered ? -210 : -9.5,
            borderRadius: "50%",
            background: accentColor,
            transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1), height 0.6s cubic-bezier(0.16, 1, 0.3, 1), left 0.6s cubic-bezier(0.16, 1, 0.3, 1), margin-top 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: 1
          }}
        />

        {/* Text */}
        <p
          style={{
            position: "absolute",
            left: 28,
            top: "50%",
            fontFamily: "Satoshi, sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: hovered ? "#09090b" : "#ffffff", // Changes to deep dark on hover
            whiteSpace: "nowrap",
            margin: 0,
            transform: hovered ? "translateY(-50%) translateX(6px)" : "translateY(-50%) translateX(0px)",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease",
            zIndex: 2
          }}
        >
          {label}
        </p>

        {/* Arrow Slider Box */}
        <div
          style={{
            position: "absolute",
            background: hovered ? "var(--color-bg)" : accentColor,
            right: 6,
            top: 5,
            height: "calc(100% - 10px)",
            width: 46,
            overflow: "hidden",
            borderRadius: borderRadius - 4,
            zIndex: 2,
            transition: "background 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              transform: hovered ? "translateX(42px)" : "translateX(0px)",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            <div style={{ position: "absolute", left: 14, top: "50%", marginTop: -9, width: 18, height: 18 }}>
              <ArrowIcon color={hovered ? accentColor : "#09090b"} />
            </div>
            <div style={{ position: "absolute", left: -28, top: "50%", marginTop: -9, width: 18, height: 18 }}>
              <ArrowIcon color={hovered ? accentColor : "#09090b"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArrowIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3 9H15M15 9L10 4M15 9L10 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
