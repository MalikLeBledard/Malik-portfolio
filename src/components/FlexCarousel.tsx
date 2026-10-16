import { useAnimationFrame, useInView } from 'framer-motion';
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';

export interface FlexCarouselItem {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

interface FlexCarouselProps {
  items: FlexCarouselItem[];
  preset?: 'ribbon';
  intro?: 'rise' | 'none';
  /** Card height as a fraction of the container height. */
  cardHeight?: number;
  /** Space between cards, in px. */
  gap?: number;
  /** How much cards outside the lens shrink in width (0 = none, 1 = fully). */
  squeeze?: number;
  focusOnClick?: boolean;
  captions?: boolean;
  /** Width multiplier of the card inside the lens. */
  lensWidth?: number;
  /** Height of cards outside the lens, relative to the focused card. */
  lensHeight?: number;
  /** Max Y rotation (deg) of cards on the sides. */
  tilt?: number;
  /** Corner rounding, 0 = square, 1 = very round. */
  roundness?: number;
  /** Width of the lens area as a fraction of the container width. */
  reach?: number;
  /** Strength of the chromatic edge fringe while moving. */
  dispersion?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
}

const CARD_ASPECT = 1.55;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function FlexCarousel({
  items,
  intro = 'rise',
  cardHeight = 0.8,
  gap = 12,
  squeeze = 0.2,
  focusOnClick = true,
  captions = true,
  lensWidth = 1.13,
  lensHeight = 0.8,
  tilt = 0,
  roundness = 0.67,
  reach = 0.34,
  dispersion = 0.4,
  autoplay = true,
  autoplayInterval = 3000,
}: FlexCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inView = useInView(containerRef, { once: true, amount: 0.2 });

  const state = useRef({
    pos: 0,
    target: 0,
    hovering: false,
    dragging: false,
    dragStartX: 0,
    dragStartTarget: 0,
    dragMoved: false,
    introStart: -1,
  });

  const n = items.length;

  // Autoplay: advance one card at a time, paused on hover / drag.
  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      const s = state.current;
      if (!s.hovering && !s.dragging) s.target = Math.round(s.target) + 1;
    }, autoplayInterval);
    return () => window.clearInterval(id);
  }, [autoplay, autoplayInterval]);

  useEffect(() => {
    if (inView && state.current.introStart < 0) state.current.introStart = performance.now();
  }, [inView]);

  useAnimationFrame((now, delta) => {
    const container = containerRef.current;
    if (!container || n === 0) return;
    const s = state.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    const prev = s.pos;
    const k = 1 - Math.exp(-(Math.min(delta, 64) / 1000) * 6);
    s.pos += (s.target - s.pos) * k;
    const velocity = ((s.pos - prev) / Math.max(delta, 1)) * 1000; // cards per second

    // Keep the aspect ratio, but never let a card take more than ~70% of the width (mobile).
    const baseW = Math.min(H * cardHeight * CARD_ASPECT, W * 0.7);
    const baseH = baseW / CARD_ASPECT;
    const lensRadius = Math.max(reach * W, 1);

    // Lens influence for a card at (fractional) distance d from the center.
    const influence = (d: number) => Math.exp(-Math.pow((d * baseW) / lensRadius, 2));
    const widthAt = (d: number) => baseW * lerp(1 - squeeze, lensWidth, influence(d));

    // Horizontal offset = integral of (width + gap) from 0 to d, so spacing stays smooth.
    const offsetAt = (d: number) => {
      const steps = Math.max(4, Math.ceil(Math.abs(d) * 6));
      const h = d / steps;
      let sum = 0;
      for (let j = 0; j < steps; j++) sum += widthAt((j + 0.5) * h) + gap;
      return sum * h;
    };

    const fringe = clamp(velocity * dispersion * 4, -14, 14);

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      let d = (((i - s.pos) % n) + n) % n;
      if (d > n / 2) d -= n;

      const x = offsetAt(d);
      const w = widthAt(d);
      if (Math.abs(x) - w / 2 > W / 2 + 40) {
        el.style.visibility = 'hidden';
        continue;
      }

      const g = influence(d);
      const h = baseH * lerp(lensHeight, 1, g);
      const radius = roundness * Math.min(w, h) * 0.12;
      const rotate = -tilt * clamp(d, -1, 1);

      let introY = 0;
      let introOpacity = 1;
      if (intro === 'rise') {
        if (s.introStart < 0) {
          introY = 80;
          introOpacity = 0;
        } else {
          const t = clamp((now - s.introStart - Math.abs(Math.round(d)) * 90) / 700, 0, 1);
          const e = easeOut(t);
          introY = (1 - e) * 80;
          introOpacity = e;
        }
      }

      el.style.visibility = 'visible';
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.borderRadius = `${radius}px`;
      el.style.opacity = String(introOpacity);
      el.style.zIndex = String(Math.round(g * 100));
      el.style.transform = `translate3d(${W / 2 + x - w / 2}px, ${(H - h) / 2 + introY}px, 0) perspective(1200px) rotateY(${rotate}deg)`;
      el.style.filter =
        Math.abs(fringe) > 0.3
          ? `drop-shadow(${fringe}px 0 0 rgba(255, 0, 90, 0.55)) drop-shadow(${-fringe}px 0 0 rgba(0, 200, 255, 0.55))`
          : 'none';

      const cap = captionRefs.current[i];
      if (cap) cap.style.opacity = String(clamp((g - 0.5) * 2, 0, 1));
    }
  });

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = state.current;
    s.dragging = true;
    s.dragMoved = false;
    s.dragStartX = e.clientX;
    s.dragStartTarget = s.target;
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = state.current;
    const container = containerRef.current;
    if (!s.dragging || !container) return;
    const dx = e.clientX - s.dragStartX;
    if (Math.abs(dx) > 5) s.dragMoved = true;
    const cardW = Math.min(container.clientHeight * cardHeight * CARD_ASPECT, container.clientWidth * 0.7);
    s.target = s.dragStartTarget - dx / cardW;
  };

  const endDrag = () => {
    const s = state.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.target = Math.round(s.target);
  };

  const focusCard = (i: number) => {
    const s = state.current;
    if (!focusOnClick || s.dragMoved) return;
    let d = (((i - s.target) % n) + n) % n;
    if (d > n / 2) d -= n;
    s.target = Math.round(s.target + d);
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden select-none touch-pan-y"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={() => (state.current.hovering = true)}
      onPointerLeave={() => {
        state.current.hovering = false;
        endDrag();
      }}
      style={{ cursor: 'grab' }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          ref={(el) => (cardRefs.current[i] = el)}
          className="absolute left-0 top-0 overflow-hidden"
          style={{ visibility: 'hidden', willChange: 'transform, width, height' }}
          onClick={() => focusCard(i)}
        >
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none"
          />
          {captions && (item.title || item.subtitle) && (
            <div
              ref={(el) => (captionRefs.current[i] = el)}
              className="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"
              style={{ opacity: 0, transition: 'opacity 0.2s' }}
            >
              {item.subtitle && (
                <p className="text-[#D7E2EA]/70 text-xs sm:text-sm uppercase tracking-widest">{item.subtitle}</p>
              )}
              {item.title && (
                <p className="text-white font-medium uppercase text-base sm:text-xl tracking-wide">{item.title}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
