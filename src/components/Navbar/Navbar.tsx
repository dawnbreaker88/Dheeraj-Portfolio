import { useEffect, useState } from 'react'
import { scrollToSection } from '../../utils/scroll'
import './Navbar.css'
import { motion, AnimatePresence } from 'framer-motion'

const WORK_SUB_LINKS = [
  { label: 'Cinematics', href: '#cinematics', desc: 'Cinematic brand films, documentaries & storytelling' },
  { label: 'UGC Ads', href: '#ugc', desc: 'Authentic & high-conversion vertical content' },
  { label: 'Photo Work', href: '#photo-editing', desc: 'Aesthetic raw grading & editorial retouching' },
]

const OTHER_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      className="chevron-icon"
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.25s ease',
        marginLeft: '6px',
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
    >
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

import BirthdaySecretModal from '../BirthdayPrank/BirthdaySecretModal'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isWorkOpen, setIsWorkOpen] = useState(false)
  const [mobileWorkOpen, setMobileWorkOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSecretOpen, setIsSecretOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    setIsWorkOpen(false)
    scrollToSection(href)
  }

  const isNavFloating = scrolled && !menuOpen

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          top: isNavFloating ? 16 : 0,
          width: isNavFloating ? (isMobile ? '92%' : '660px') : '100%',
          height: isNavFloating ? 54 : 80,
          borderRadius: isNavFloating ? 32 : 0,
          backgroundColor: isNavFloating
            ? 'rgba(20, 20, 22, 0.75)'
            : (scrolled || menuOpen ? 'rgba(9, 9, 11, 0.98)' : 'rgba(9, 9, 11, 0)'),
          borderColor: isNavFloating ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0)',
          boxShadow: isNavFloating ? '0 12px 35px rgba(0, 0, 0, 0.4)' : 'none',
          backdropFilter: isNavFloating || scrolled || menuOpen ? 'blur(20px)' : 'blur(0px)',
          paddingLeft: isNavFloating ? 24 : (isMobile ? 24 : 48),
          paddingRight: isNavFloating ? 24 : (isMobile ? 24 : 48),
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 21,
          mass: 0.9,
          opacity: { duration: 0.3 },
          backgroundColor: { duration: 0.4 },
          borderColor: { duration: 0.4 },
          backdropFilter: { duration: 0.4 }
        }}
        style={{
          borderWidth: 1,
          borderStyle: 'solid',
        }}
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        aria-label="Main navigation"
      >
        <div className="nav-inner">
          <a
            href="#secret"
            className="nav-logo"
            onClick={(e) => {
              e.preventDefault()
              setIsSecretOpen(true)
            }}
            data-cursor="link"
            title="Classified Secret"
          >
            DHEERAJ
          </a>

          {/* Desktop links */}
          <ul className="nav-links" role="list">
            {/* Work Dropdown */}
            <li
              className="nav-link-wrapper"
              onMouseEnter={() => setIsWorkOpen(true)}
              onMouseLeave={() => setIsWorkOpen(false)}
            >
              <button
                className="nav-link dropdown-trigger"
                onClick={() => setIsWorkOpen(!isWorkOpen)}
                data-cursor="link"
              >
                Work <ChevronIcon isOpen={isWorkOpen} />
              </button>
              <AnimatePresence>
                {isWorkOpen && (
                  <motion.div
                    className="nav-dropdown glass-card"
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ul className="dropdown-list">
                      {WORK_SUB_LINKS.map(subLink => (
                        <li key={subLink.href}>
                          <a
                            href={subLink.href}
                            className="dropdown-item"
                            onClick={(e) => {
                              e.preventDefault();
                              scrollTo(subLink.href);
                              setIsWorkOpen(false);
                            }}
                          >
                            <span className="dropdown-item-title">{subLink.label}</span>
                            <span className="dropdown-item-desc">{subLink.desc}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Other links */}
            {OTHER_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="nav-link"
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
                  data-cursor="link"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Hamburger (mobile) */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu" aria-label="Mobile navigation">
            {/* Work Mobile Accordion */}
            <div className="mobile-dropdown-wrapper">
              <button
                className="mobile-link mobile-dropdown-trigger"
                onClick={() => setMobileWorkOpen(!mobileWorkOpen)}
              >
                Work <ChevronIcon isOpen={mobileWorkOpen} />
              </button>
              <AnimatePresence>
                {mobileWorkOpen && (
                  <motion.div
                    className="mobile-sub-menu"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    {WORK_SUB_LINKS.map((subLink) => (
                      <a
                        key={subLink.href}
                        href={subLink.href}
                        className="mobile-sub-link"
                        onClick={(e) => { e.preventDefault(); scrollTo(subLink.href) }}
                      >
                        {subLink.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Mobile Links */}
            {OTHER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="mobile-link"
                onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </motion.nav>

      {/* Secret Birthday Prank Modal & Black Screen Viewport */}
      <BirthdaySecretModal
        isOpen={isSecretOpen}
        onClose={() => setIsSecretOpen(false)}
      />
    </>
  )
}
