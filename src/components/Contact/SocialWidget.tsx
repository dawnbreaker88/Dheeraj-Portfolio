import React, { useState } from 'react'
import { motion } from 'framer-motion'

export interface SocialWidgetProps {
  instagram?: string
  email?: string
  linkedin?: string
  behance?: string
  whatsapp?: string
}

export default function SocialWidget({
  instagram = "https://www.instagram.com/heyy.dheeraj/",
  email = "mailto:mettudheerajreddy9@gmail.com",
  linkedin = "https://www.linkedin.com/in/dheeraj-reddy-98b294345/",
  behance = "#",
  whatsapp = "https://wa.me/918758054054"
}: SocialWidgetProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
      className="social-widget-container glass-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        borderRadius: '999px',
        background: 'rgba(20, 20, 22, 0.55)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isHovered
          ? '0 20px 45px rgba(0, 0, 0, 0.5), 0 0 15px 2px rgba(124, 58, 237, 0.15)'
          : '0 15px 35px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        cursor: 'pointer',
        height: '70px',
        maxWidth: 'fit-content',
        margin: '0 auto',
        pointerEvents: 'auto',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
      }}
      whileHover={{ scale: 1.02, borderColor: 'rgba(124, 58, 237, 0.3)' }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
    >
      {!isHovered ? (
        <motion.div
          key="trigger"
          layoutId="widget-content"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0 20px',
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap'
          }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          >
            <IconGlobe />
          </motion.div>
          <span style={{
            fontSize: '12.5px',
            fontFamily: 'Satoshi, sans-serif',
            letterSpacing: '0.18em',
            fontWeight: 800,
            color: 'var(--color-text-primary)'
          }}>
            CONNECT WITH ME
          </span>
        </motion.div>
      ) : (
        <motion.div
          key="icons"
          layoutId="widget-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0 10px'
          }}
        >
          <SocialIcon href={whatsapp} label="WhatsApp" icon={IconWhatsApp} color="#25D366" />
          <SocialIcon href={instagram} label="Instagram" icon={IconInstagram} color="#E1306C" />
          <SocialIcon href={linkedin} label="LinkedIn" icon={IconLinkedIn} color="#0077B5" />
          {/* <SocialIcon href={behance} label="Behance" icon={IconBehance} color="#1769ff" /> */}
          <SocialIcon href={email} label="Email" icon={IconEmail} color="#ea4335" />
        </motion.div>
      )}
    </motion.div>
  )
}

function SocialIcon({
  href,
  icon: Icon,
  label,
  color
}: {
  href: string;
  icon: React.ComponentType;
  label: string;
  color: string
}) {
  const [isIconHovered, setIsIconHovered] = useState(false)

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setIsIconHovered(true)}
      onMouseLeave={() => setIsIconHovered(false)}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.92 }}
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isIconHovered ? color : 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: isIconHovered ? '#000000' : 'var(--color-text-primary)',
        transition: 'background-color 0.25s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        cursor: 'pointer',
        borderColor: isIconHovered ? color : 'rgba(255, 255, 255, 0.08)',
        boxShadow: isIconHovered ? `0 0 15px ${color}55` : 'none'
      }}
    >
      <Icon />
    </motion.a>
  )
}

// ── SVG Icon Components ──────────────────────────────────────
function IconGlobe() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent)' }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="18" height="18" rx="5" />
      <circle cx="11" cy="11" r="4" />
      <circle cx="16.5" cy="5.5" r="1" fill="currentColor" />
    </svg>
  )
}

function IconEmail() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="18" height="13" rx="2" />
      <path d="M2 8l9 5 9-5" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="18" height="18" rx="4" />
      <path d="M7 9v6M7 7v.5M11 15v-3.5c0-1 .5-1.5 1.5-1.5s1.5.5 1.5 1.5V15" />
    </svg>
  )
}

function IconBehance() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 11h7c1.66 0 3-1.34 3-3s-1.34-3-3-3H2v12h7c1.93 0 3.5-1.57 3.5-3.5S10.93 11 9 11z" />
      <path d="M14 9h6M13 13c0 2.21 1.79 4 4 4s4-1.79 4-4H13z" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="9" />
      <path d="M7.5 11.5c1 1.8 2.8 3.2 5 3.2l.5-1.8-1.8-.9-.5.9c-.8-.2-.8-1.5-.8-2.4l.9-.5-.9-1.8c-1.3.4-1.8 1.8-1.8 3.6z" />
    </svg>
  )
}
