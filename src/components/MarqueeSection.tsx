import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import FlexCarousel, { type FlexCarouselApi, type FlexCarouselItem } from './FlexCarousel';
import SlingButton from './SlingButton';
import PulseHeart from './PulseHeart';
import { PILL_GRADIENT_STYLE } from './ContactButton';
import FadeIn from './FadeIn';

// Fred's own work: demo sites (live under /demos/...) and Airbnb video tours.
const PROJECTS: FlexCarouselItem[] = [
  { src: '/showcase/fred-cafe.jpg', alt: 'Fred Café 3D coffee website', title: 'MK Cofee', subtitle: '3D website · Live demo ↗', href: 'https://mk-cofee.vercel.app/' },
  { src: '/showcase/mk-cafe.jpg', alt: 'MK Café coffee website', title: 'MK Café', subtitle: 'Website · Live demo ↗', href: 'https://mk-cafe-kappa.vercel.app/' },
  { src: '/showcase/airbnb-1.jpg', video: '/showcase/airbnb-1.mp4', alt: 'Airbnb 4K video walkthrough', title: 'Modern Family Home', subtitle: 'Airbnb video tour' },
  { src: '/showcase/fred-croquetta.jpg', alt: 'Fred Croquetta 3D dog food website', title: 'MK Croquetta', subtitle: '3D website · Live demo ↗', href: 'https://mk-croquetta.vercel.app/' },
  { src: '/showcase/fred-plumbing.jpg', alt: 'Fred Plumbing booking app', title: 'Fred Plumbing', subtitle: 'Mobile app · Live demo ↗', href: '/demos/fred-plumbing/' },
  { src: '/showcase/visite-dubai.jpg', alt: 'Business Bay Dubai apartment tour website', title: 'Visite Business Bay', subtitle: '360° virtual tour · Live demo ↗', href: 'https://visite-dubai-business-bay.vercel.app/' },
  { src: '/showcase/visite-doha.jpg', alt: 'Al Mansoura Doha apartment tour website', title: 'Visite Doha', subtitle: '360° virtual tour · Live demo ↗', href: 'https://visite-doha-mansoura602.vercel.app/' },
  { src: '/showcase/fred-studio.jpg', alt: 'Fred Studio agency website', title: 'Fred Studio', subtitle: 'Business website · Live demo ↗', href: '/demos/fred-studio/' },
];

// Repeat the list so the ribbon always has cards on both sides of the centre.
const ITEMS = [...PROJECTS, ...PROJECTS];

// Starting like count per card: a fixed number between 20 and 90 (same on every visit).
const startLikes = (i: number) => 20 + (((i % PROJECTS.length) * 37 + 23) % 71);

const SLING_PROPS = {
  axis: 'horizontal' as const,
  size: 52,
  accentColor: '#B600A8',
  bandColor: '#7621B0',
};

export default function MarqueeSection() {
  const carousel = useRef<FlexCarouselApi>(null);

  return (
    <section id="projects" className="pt-24 sm:pt-32 md:pt-40 pb-10" style={{ background: '#0C0C0C' }}>
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-10 sm:mb-14 md:mb-16"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Projects
        </h2>
      </FadeIn>
      <div className="relative w-full h-[340px] sm:h-[460px] md:h-[560px]">
        <FlexCarousel
          items={ITEMS}
          preset="ribbon"
          intro="rise"
          cardHeight={0.8}
          gap={12}
          squeeze={0.2}
          focusOnClick
          captions
          lensWidth={1.13}
          lensHeight={0.8}
          tilt={0}
          roundness={0.67}
          reach={0.34}
          dispersion={0.4}
          autoplay={false}
          apiRef={carousel}
          badge={
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-white font-black uppercase tracking-wider text-xs sm:text-sm"
              style={PILL_GRADIENT_STYLE}
            >
              ✦ Fred
            </span>
          }
          renderOverlay={(_, i) => (
            <PulseHeart count={startLikes(i)} size={22} pillColor="rgba(12, 12, 12, 0.65)" label="Like" />
          )}
        />
      </div>

      <div className="flex justify-center gap-10 sm:gap-14 mt-8 sm:mt-10">
        <SlingButton {...SLING_PROPS} ariaLabel="Previous project" onSend={() => carousel.current?.prev()}>
          <ArrowLeft size={22} strokeWidth={2.2} />
        </SlingButton>
        <SlingButton {...SLING_PROPS} ariaLabel="Next project" onSend={() => carousel.current?.next()}>
          <ArrowRight size={22} strokeWidth={2.2} />
        </SlingButton>
      </div>
    </section>
  );
}
