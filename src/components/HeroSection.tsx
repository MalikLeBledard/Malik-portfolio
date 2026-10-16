import FadeIn from './FadeIn';
import Magnet from './Magnet';
import ContactButton, { PILL_GRADIENT_STYLE } from './ContactButton';

const NAV_LINKS = ['About', 'Price', 'Projects', 'Contact'];
const PILL_LINKS = ['About', 'Price', 'Projects'];
const PORTRAIT = '/fred.png';

export default function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn as="nav" delay={0} y={-20} className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
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

      <div className="overflow-hidden">
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

      <div className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <img src={PORTRAIT} alt="Fred portrait" className="w-full h-auto select-none" draggable={false} />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}
