import FadeIn from './FadeIn';
import LiquidEther from './LiquidEther';
import ContactButton, { PILL_GRADIENT_STYLE } from './ContactButton';

const NAV_LINKS = ['About', 'Price', 'Projects', 'Contact'];
const PILL_LINKS = ['About', 'Price', 'Projects'];

export default function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col" style={{ overflowX: 'clip' }}>
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B497CF']}
          mouseForce={20}
          cursorSize={100}
          resolution={0.5}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
        />
      </div>

      <FadeIn as="nav" delay={0} y={-20} className="relative z-10 flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
        {NAV_LINKS.map((link) =>
          PILL_LINKS.includes(link) ? (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="rounded-full text-white font-medium uppercase tracking-wider text-xs sm:text-sm md:text-lg lg:text-[1.4rem] px-3 py-1.5 sm:px-5 sm:py-2 md:px-7 md:py-2.5 transition-transform duration-200 hover:scale-[1.05]"
              style={PILL_GRADIENT_STYLE}
            >
              {link}
            </a>
          ) : (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-xs sm:text-sm md:text-lg lg:text-[1.4rem] transition-opacity duration-200 hover:opacity-70"
            >
              {link}
            </a>
          )
        )}
      </FadeIn>

      <div className="relative z-10 overflow-hidden pointer-events-none">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-6 sm:mt-4 md:-mt-5">
            Hi, i&apos;m fred
          </h1>
        </FadeIn>
      </div>

      <div className="mt-auto flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 relative z-20">
        <FadeIn delay={0.35} y={20}>
          <p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            a creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

    </section>
  );
}
