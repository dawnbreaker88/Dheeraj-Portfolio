/**
 * CurvedCarousel — React port of the Framer "CurvedCarousel" component
 * Original: https://framer.com/m/CurvedCarousel-5H9n6y.js
 *
 * Framer-specific APIs removed (addPropertyControls, useIsStaticRenderer).
 * Wired to accept plain video/poster items for the UGC section.
 */
import React, {
  useState,
  useRef,
  useEffect,
  startTransition,
  useMemo,
  useCallback,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  useMotionTemplate,
} from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CurvedCarouselItem {
  video?: string;
  image?: { src: string; alt?: string };
  title?: string;
  description?: string;
}

export interface CurvedCarouselProps {
  items: CurvedCarouselItem[];
  /** called when the centre card changes */
  onActiveChange?: (index: number) => void;
  // Layout
  cardWidth?: number;
  cardHeight?: number;
  visibleCards?: number;
  // 3D
  radiusDepth?: number;
  verticalDip?: number;
  // Animation
  animationStiffness?: number;
  animationDamping?: number;
  // Video
  videoAutoPlay?: boolean;
  videoLoop?: boolean;
  // Appearance
  removeBackground?: boolean;
  backgroundColor?: string;
  cardBackgroundColor?: string;
  cardBorderRadius?: number;
  imageHeightPercent?: number;
  showContentOnHover?: boolean;
  // Navigation
  showDots?: boolean;
  buttonColor?: string;
  buttonHoverColor?: string;
  buttonArrowColor?: string;
  buttonSize?: number;
  buttonSideOffset?: number;
  // Auto play
  autoPlay?: boolean;
  autoPlayInterval?: number;
  // Effects
  enableDepthOfField?: boolean;
  depthOfFieldIntensity?: number;
  dynamicShadowDepth?: number;
  enableTilt?: boolean;
  tiltIntensity?: number;
  tiltSmoothing?: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hexToRgba(color: string, alpha: number): string {
  if (color.startsWith("#")) {
    let r: number, g: number, b: number;
    if (color.length === 7) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    } else if (color.length === 4) {
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    } else {
      return color;
    }
    if (isNaN(r) || isNaN(g) || isNaN(b)) return color;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  const rgbMatch = color.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/
  );
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CurvedCarousel({
  items = [],
  onActiveChange,
  cardWidth = 280,
  cardHeight = 460,
  visibleCards = 5,
  radiusDepth = 400,
  verticalDip = 30,
  animationStiffness = 200,
  animationDamping = 25,
  videoAutoPlay = true,
  videoLoop = true,
  removeBackground = true,
  backgroundColor = "transparent",
  cardBackgroundColor = "#111111",
  cardBorderRadius = 16,
  imageHeightPercent = 70,
  showContentOnHover = false,
  showDots = true,
  buttonColor = "rgba(255,255,255,0.1)",
  buttonHoverColor = "rgba(255,255,255,0.2)",
  buttonArrowColor = "#ffffff",
  buttonSize = 44,
  buttonSideOffset = 16,
  autoPlay = false,
  autoPlayInterval = 3,
  enableDepthOfField = false,
  depthOfFieldIntensity = 4,
  dynamicShadowDepth = 1,
  enableTilt = false,
  tiltIntensity = 10,
  tiltSmoothing = 150,
}: CurvedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [containerWidth, setContainerWidth] = useState(
    typeof window === "undefined" ? 800 : window.innerWidth
  );

  const [isTouchDevice] = useState(
    () =>
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );

  // ── Resize observer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) startTransition(() => setContainerWidth(w));
    };
    update();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    } else {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
  }, []);

  const totalItems = items.length;

  // ── Navigation — NO startTransition: must be synchronous so clicks respond instantly ──
  const goToPrevious = useCallback(() => {
    if (totalItems <= 1) return;
    setCurrentIndex((prev) => ((prev - 1) % totalItems + totalItems) % totalItems);
  }, [totalItems]);

  const goToNext = useCallback(() => {
    if (totalItems <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Notify parent
  useEffect(() => {
    onActiveChange?.(currentIndex);
  }, [currentIndex, onActiveChange]);

  // ── Auto play ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay || totalItems === 0) return;
    // startTransition is fine for autoplay — it's a background tick, not a user gesture
    const id = setInterval(
      () => startTransition(() => setCurrentIndex((p) => (p + 1) % totalItems)),
      autoPlayInterval * 1000
    );
    autoPlayTimerRef.current = id;
    return () => clearInterval(id);
  }, [autoPlay, autoPlayInterval, totalItems]);

  // ── Touch / drag ────────────────────────────────────────────────────────
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      touchStartX.current = clientX;
      touchStartY.current = clientY;
      isDragging.current = true;
    },
    []
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging.current) return;
      const clientX =
        "changedTouches" in e
          ? e.changedTouches[0].clientX
          : "clientX" in e
          ? e.clientX
          : touchStartX.current;
      const clientY =
        "changedTouches" in e
          ? e.changedTouches[0].clientY
          : "clientY" in e
          ? e.clientY
          : touchStartY.current;
      const dx = clientX - touchStartX.current;
      const dy = clientY - touchStartY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx > 0) goToPrevious();
        else goToNext();
      }
      isDragging.current = false;
    },
    [goToPrevious, goToNext]
  );

  // non-passive touchmove to suppress scroll on horizontal swipe
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
      if (dx > dy && dx > 10) e.preventDefault();
    };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, []);

  // ── Keyboard ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goToPrevious(); }
      if (e.key === "ArrowRight") { e.preventDefault(); goToNext(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToPrevious, goToNext]);

  // ── Tilt ────────────────────────────────────────────────────────────────
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: tiltSmoothing, damping: 30, mass: 0.5 });
  const smoothTiltY = useSpring(tiltY, { stiffness: tiltSmoothing, damping: 30, mass: 0.5 });
  const [cardTiltX, setCardTiltX] = useState(0);
  const [cardTiltY, setCardTiltY] = useState(0);
  useMotionValueEvent(smoothTiltX, "change", (v) => { if (enableTilt) startTransition(() => setCardTiltX(v)); });
  useMotionValueEvent(smoothTiltY, "change", (v) => { if (enableTilt) startTransition(() => setCardTiltY(v)); });
  useEffect(() => {
    if (!enableTilt) { tiltX.set(0); tiltY.set(0); startTransition(() => { setCardTiltX(0); setCardTiltY(0); }); }
  }, [enableTilt, tiltX, tiltY]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enableTilt) return;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      tiltX.set(y * tiltIntensity);
      tiltY.set(-x * tiltIntensity);
    },
    [enableTilt, tiltX, tiltY, tiltIntensity]
  );

  const handleMouseLeave = useCallback(() => {
    if (!enableTilt) return;
    tiltX.set(0);
    tiltY.set(0);
  }, [enableTilt, tiltX, tiltY]);

  // ── Layout helpers ──────────────────────────────────────────────────────
  const isMobileView = containerWidth < 768;
  const isTabletView = containerWidth >= 768 && containerWidth < 1024;
  const isVerySmall = containerWidth <= 320;
  const isSmallMobile = containerWidth <= 480;

  const activeButtonSize = isVerySmall
    ? buttonSize * 0.6
    : isSmallMobile
    ? buttonSize * 0.65
    : isMobileView
    ? buttonSize * 0.7
    : isTabletView
    ? buttonSize * 0.85
    : buttonSize;

  const activeButtonOffset = isVerySmall
    ? Math.max(5, buttonSideOffset * 0.5)
    : isSmallMobile
    ? Math.max(8, buttonSideOffset * 0.6)
    : isMobileView
    ? Math.max(10, buttonSideOffset * 0.7)
    : isTabletView
    ? buttonSideOffset * 0.85
    : buttonSideOffset;

  const dotSize = isVerySmall ? 5 : isSmallMobile ? 5.5 : isMobileView ? 6 : 8;
  const dotActiveWidth = isVerySmall ? 18 : isSmallMobile ? 20 : isMobileView ? 24 : 32;
  const dotHoverWidth = isVerySmall ? 10 : isSmallMobile ? 11 : isMobileView ? 12 : 16;

  const horizontalSpread = useMemo(() => {
    if (containerWidth <= 320) return Math.max(600, cardWidth * 2.2);
    if (containerWidth <= 480) return Math.max(700, cardWidth * 2.3);
    if (containerWidth < 768) return Math.max(750, cardWidth * 2.4);
    return Math.max(800, cardWidth * 2.5);
  }, [cardWidth, containerWidth]);

  // ── 3D card transform ───────────────────────────────────────────────────
  const getCardTransform = useCallback(
    (position: number, tX = 0, tY = 0) => {
      const normalizedPos = position / Math.max(visibleCards, 1);
      const angle = normalizedPos * Math.PI * 0.5;
      const x = Math.sin(angle) * horizontalSpread;
      const y = Math.abs(position) * verticalDip;

      const isNarrow = containerWidth <= 320;
      const isSmall = containerWidth <= 480;
      const isMedium = containerWidth <= 768;
      const respDepth = isNarrow
        ? radiusDepth * 2.2
        : isSmall
        ? radiusDepth * 1.8
        : isMedium
        ? radiusDepth * 1.4
        : radiusDepth;

      let baseZ: number, depthMult: number, scale: number, rotateY: number;
      if (isNarrow) {
        baseZ = -Math.abs(Math.cos(angle) - 1) * respDepth * 0.9;
        depthMult = Math.abs(position) * respDepth * 0.55;
        scale = Math.max(0.25, 1 - Math.abs(position) * 0.32);
        rotateY = angle * 65;
      } else if (isSmall) {
        baseZ = -Math.abs(Math.cos(angle) - 1) * respDepth * 0.85;
        depthMult = Math.abs(position) * respDepth * 0.5;
        scale = Math.max(0.3, 1 - Math.abs(position) * 0.28);
        rotateY = angle * 55;
      } else if (isMedium) {
        baseZ = -Math.abs(Math.cos(angle) - 1) * respDepth * 0.8;
        depthMult = Math.abs(position) * respDepth * 0.45;
        scale = Math.max(0.35, 1 - Math.abs(position) * 0.22);
        rotateY = angle * 48;
      } else {
        baseZ = -Math.abs(Math.cos(angle) - 1) * respDepth;
        depthMult = Math.abs(position) * respDepth * 0.5;
        scale = Math.max(0.4, 1 - Math.abs(position) * 0.18);
        rotateY = angle * 40;
      }

      const z = baseZ - depthMult;
      const opacity = Math.max(0.3, 1 - Math.abs(position) * 0.3);
      const zIndex = Math.round(10000 + z * 10);
      const blurAmount = enableDepthOfField ? Math.abs(position) * depthOfFieldIntensity : 0;

      const shadowDist = Math.abs(z) / respDepth;
      const shadowBlur = 30 + shadowDist * 50 * dynamicShadowDepth;
      const shadowSpread = 10 + shadowDist * 20 * dynamicShadowDepth;
      const shadowOpacity = 0.15 + shadowDist * 0.25 * dynamicShadowDepth;

      const depthFactor = Math.abs(z) / respDepth;
      const rotateX = enableTilt ? tX * (1 + depthFactor * 0.5) : 0;
      const rotateYFinal = rotateY + (enableTilt ? tY * (1 + depthFactor * 0.5) : 0);

      return { x, y, z, scale, rotateY: rotateYFinal, rotateX, opacity, zIndex, blurAmount, shadowBlur, shadowSpread, shadowOpacity };
    },
    [radiusDepth, verticalDip, visibleCards, horizontalSpread, enableDepthOfField, depthOfFieldIntensity, dynamicShadowDepth, enableTilt, containerWidth]
  );

  const handleCardClick = useCallback(
    (index: number) => {
      if (index !== currentIndex) startTransition(() => setCurrentIndex(index));
    },
    [currentIndex]
  );

  // ── Visible items ────────────────────────────────────────────────────────
  const visibleItems = useMemo(() => {
    if (totalItems === 0) return [];
    const maxVisible = Math.ceil(visibleCards / 2);
    return items
      .map((item, index) => {
        let position = index - currentIndex;
        if (position > totalItems / 2) position -= totalItems;
        else if (position < -totalItems / 2) position += totalItems;
        if (Math.abs(position) > maxVisible) return null;
        return { item, index, position };
      })
      .filter(Boolean) as { item: CurvedCarouselItem; index: number; position: number }[];
  }, [items, currentIndex, totalItems, visibleCards]);

  const springConfig = useMemo(
    () => ({ type: "spring" as const, stiffness: animationStiffness, damping: animationDamping, mass: 0.8, restDelta: 0.001, restSpeed: 0.001 }),
    [animationStiffness, animationDamping]
  );

  const bgStyle: React.CSSProperties = removeBackground
    ? { backgroundColor: "transparent" }
    : { backgroundColor };

  if (totalItems === 0) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", ...bgStyle, color: "#ffffff", fontSize: 16 }}>
        No items to display
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        ...bgStyle,
        perspective: 3000,
        perspectiveOrigin: "50% 50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "pan-y",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart as any}
      onTouchEnd={handleTouchEnd as any}
      onMouseDown={handleTouchStart as any}
      onMouseUp={handleTouchEnd as any}
      role="region"
      aria-label="3D Video Carousel"
    >
      {/* Card stage */}
      <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", isolation: "isolate" }}>
        {visibleItems.map(({ item, index, position }) => {
          const isCenter = index === currentIndex;
          const transform = getCardTransform(position, cardTiltX, cardTiltY);

          return (
            <motion.div
              key={index}
              onClick={() => handleCardClick(index)}
              tabIndex={0}
              role="button"
              aria-label={`Slide ${index + 1}${item.title ? `: ${item.title}` : ""}`}
              aria-current={isCenter ? "true" : "false"}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick(index); }
              }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: cardWidth,
                height: cardHeight,
                marginLeft: -cardWidth / 2,
                marginTop: -cardHeight / 2,
                transformStyle: "preserve-3d",
                cursor: isCenter ? "default" : "pointer",
                zIndex: transform.zIndex,
                willChange: "transform, opacity",
                filter: `blur(${transform.blurAmount}px)`,
                outline: "none",
              }}
              animate={{
                x: transform.x,
                y: transform.y,
                z: transform.z,
                scale: transform.scale,
                rotateY: transform.rotateY,
                rotateX: transform.rotateX,
                opacity: transform.opacity,
              }}
              transition={springConfig}
            >
              <motion.div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: cardBorderRadius,
                  overflow: "hidden",
                  backgroundColor: cardBackgroundColor,
                  display: "flex",
                  flexDirection: "column",
                  pointerEvents: "auto",
                  boxShadow: `0 ${Math.round(transform.shadowSpread)}px ${Math.round(transform.shadowBlur)}px rgba(0,0,0,${transform.shadowOpacity.toFixed(2)})`,
                  position: "relative",
                }}
                whileHover={isCenter ? { scale: 1.02 } : undefined}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onMouseEnter={() => { if (showContentOnHover && !isTouchDevice) startTransition(() => setHoveredCardIndex(index)); }}
                onMouseLeave={() => { if (showContentOnHover && !isTouchDevice) startTransition(() => setHoveredCardIndex(null)); }}
              >
                {/* Video */}
                {item.video ? (
                  <div style={{ width: "100%", height: showContentOnHover ? "100%" : `${imageHeightPercent}%`, position: showContentOnHover ? "absolute" : "relative", top: 0, left: 0, overflow: "hidden" }}>
                    {isCenter ? (
                      <>
                        <video
                          src={item.video}
                          autoPlay={videoAutoPlay}
                          loop={videoLoop}
                          muted={isMuted}
                          playsInline
                          preload="metadata"
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          aria-label={item.title ? `Video for ${item.title}` : `Video ${index + 1}`}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMuted(!isMuted);
                          }}
                          style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "rgba(9, 9, 11, 0.65)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            zIndex: 20,
                            transition: "background 0.2s, transform 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(9, 9, 11, 0.85)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(9, 9, 11, 0.65)";
                          }}
                          title={isMuted ? "Unmute" : "Mute"}
                          aria-label={isMuted ? "Unmute video" : "Mute video"}
                        >
                          {isMuted ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 5L6 9H2v6h4l5 4V5z" />
                              <line x1="23" y1="9" x2="17" y2="15" />
                              <line x1="17" y1="9" x2="23" y2="15" />
                            </svg>
                          ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 5L6 9H2v6h4l5 4V5z" />
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            </svg>
                          )}
                        </button>
                      </>
                    ) : item.image ? (
                      <img
                        src={item.image.src}
                        alt={item.image.alt || item.title || "Preview"}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", backgroundColor: "#111" }} />
                    )}
                  </div>
                ) : item.image ? (
                  <div
                    style={{
                      width: "100%",
                      height: showContentOnHover ? "100%" : `${imageHeightPercent}%`,
                      backgroundImage: `url(${item.image.src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: showContentOnHover ? "absolute" : "relative",
                      top: 0, left: 0,
                    }}
                    role="img"
                    aria-label={item.image.alt || "Card image"}
                  />
                ) : null}

                {/* Inner highlight ring */}
                <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: cardBorderRadius, pointerEvents: "none", zIndex: 10, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }} />

                {/* Text content */}
                {(item.title || item.description) && (
                  <motion.div
                    style={{
                      paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16,
                      display: "flex", flexDirection: "column", gap: 6,
                      willChange: "opacity, transform",
                      overflow: "hidden",
                      ...(showContentOnHover
                        ? {
                            position: "absolute",
                            bottom: 0, left: 0, right: 0,
                            background: "linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.85))",
                            backdropFilter: "blur(6px)",
                          }
                        : {
                            flex: 1,
                            position: "relative",
                            maxHeight: `${100 - imageHeightPercent}%`,
                          }),
                    }}
                    initial={showContentOnHover ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
                    animate={
                      showContentOnHover
                        ? hoveredCardIndex === index
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 12 }
                        : { opacity: 1, y: 0 }
                    }
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {item.title && (
                      <h3 style={{
                        margin: 0, color: "#ffffff", fontSize: 15, fontWeight: 600,
                        letterSpacing: "-0.01em", lineHeight: "1.25em",
                        overflow: "hidden", textOverflow: "ellipsis",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                      }}>
                        {item.title}
                      </h3>
                    )}
                    {item.description && (
                      <p style={{
                        margin: 0, color: "rgba(255,255,255,0.7)", fontSize: 13,
                        lineHeight: "1.4em", overflow: "hidden", textOverflow: "ellipsis",
                        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
                      }}>
                        {item.description}
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Prev button */}
      <motion.button
        onClick={goToPrevious}
        whileHover={{ backgroundColor: buttonHoverColor }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "absolute",
          left: isMobileView ? Math.max(10, activeButtonOffset) : activeButtonOffset,
          top: "50%", transform: "translateY(-50%)",
          width: activeButtonSize, height: activeButtonSize,
          borderRadius: "50%", border: "none",
          backgroundColor: buttonColor,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10001, boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          outline: "none", padding: 0, flexShrink: 0,
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        }}
        aria-label="Previous slide"
      >
        <svg width={activeButtonSize * 0.38} height={activeButtonSize * 0.38} viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" stroke={buttonArrowColor} />
        </svg>
      </motion.button>

      {/* Next button */}
      <motion.button
        onClick={goToNext}
        whileHover={{ backgroundColor: buttonHoverColor }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "absolute",
          right: isMobileView ? Math.max(10, activeButtonOffset) : activeButtonOffset,
          top: "50%", transform: "translateY(-50%)",
          width: activeButtonSize, height: activeButtonSize,
          borderRadius: "50%", border: "none",
          backgroundColor: buttonColor,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10001, boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          outline: "none", padding: 0, flexShrink: 0,
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        }}
        aria-label="Next slide"
      >
        <svg width={activeButtonSize * 0.38} height={activeButtonSize * 0.38} viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" stroke={buttonArrowColor} />
        </svg>
      </motion.button>

      {/* Dots */}
      {showDots && (
        <div
          role="tablist"
          aria-label="Carousel navigation"
          style={{
            position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "row", gap: 6, zIndex: 10,
            padding: "7px 12px",
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            borderRadius: 20,
          }}
        >
          {items.map((_, i) => {
            const isActive = i === currentIndex;
            return (
              <motion.button
                key={i}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={isActive ? "true" : "false"}
                onClick={() => goTo(i)}
                style={{
                  height: dotSize, borderRadius: dotSize / 2,
                  border: "none", backgroundColor: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                  cursor: "pointer", padding: 0, outline: "none",
                  willChange: "width, background-color",
                }}
                animate={{ width: isActive ? dotActiveWidth : dotSize }}
                whileHover={{ backgroundColor: "#fff", width: isActive ? dotActiveWidth : dotHoverWidth }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.5 }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
