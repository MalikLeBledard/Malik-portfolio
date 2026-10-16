import FadeIn from './FadeIn';
import ContactButton from './ContactButton';
import LiquidEther from './LiquidEther';
import GooeyNav from './GooeyNav';
import ProfileCard from './ProfileCard';

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Price', href: '#price' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[640px] flex flex-col" style={{ overflowX: 'clip' }}>
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

      <FadeIn as="header" delay={0} y={-20} className="relative z-20 flex justify-center px-4 md:px-10 pt-6 md:pt-8">
        <GooeyNav items={NAV_ITEMS} initialActiveIndex={0} size="md" />
      </FadeIn>

      <div className="relative z-10 overflow-hidden pointer-events-none">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-center text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-6 sm:mt-4 md:-mt-2">
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

      <div className="absolute left-1/2 -translate-x-1/2 z-10 w-[240px] sm:w-[270px] lg:w-[300px] top-1/2 -translate-y-[30%]">
        <FadeIn delay={0.6} y={30}>
          <ProfileCard
            avatarUrl="/malik.png"
            backdropColor="#7621B0"
            name="Malik Fred"
            title="Creator"
            handle="malikfred"
            status="Online"
            contactText="Contact"
            onContactClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            theme="dark"
          />
        </FadeIn>
      </div>
    </section>
  );
}
