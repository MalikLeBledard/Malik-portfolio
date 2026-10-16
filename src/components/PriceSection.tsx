import { Check } from 'lucide-react';
import FadeIn from './FadeIn';
import PixelCard, { type PixelCardProps } from './PixelCard';
import { PILL_GRADIENT_STYLE } from './ContactButton';

interface Offer {
  name: string;
  tagline: string;
  price: string;
  features: string[];
  popular?: boolean;
  pixels: Pick<PixelCardProps, 'variant' | 'colors' | 'glowColor'>;
}

const OFFERS: Offer[] = [
  {
    name: 'Airbnb Showcase',
    tagline: 'Make your listing stand out and get booked faster.',
    price: '29.99',
    features: [
      'Cinematic 4K video walkthrough of your property',
      'Professional photo enhancement (lighting, color, clarity)',
      'Ready to upload to Airbnb and social media',
    ],
    popular: true,
    pixels: { colors: ['#f5d0fe', '#d946ef', '#B600A8'], glowColor: '#B600A8' },
  },
  {
    name: 'Custom Website',
    tagline: 'A modern website built around your brand.',
    price: '199',
    features: [
      'Custom, modern design tailored to you',
      'Fast loading on every device',
      'Secure (HTTPS / SSL)',
      '1 year of hosting included',
    ],
    pixels: { variant: 'blue' },
  },
  {
    name: '3D Website',
    tagline: 'An immersive 3D experience your visitors will remember.',
    price: '299',
    features: [
      'Custom interactive 3D website',
      'Optimized for speed and smooth performance',
      'Secure (HTTPS / SSL)',
      '1 year of hosting included',
    ],
    pixels: { variant: 'yellow' },
  },
];

export default function PriceSection() {
  return (
    <section
      id="price"
      className="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-24 sm:pb-32"
      style={{ background: '#0C0C0C' }}
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Price
        </h2>
      </FadeIn>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
        {OFFERS.map((offer, i) => (
          <FadeIn key={offer.name} delay={i * 0.12} className="w-full max-w-[380px]">
            <PixelCard
              {...offer.pixels}
              radius={32}
              className={`w-full h-[540px] !place-items-stretch ${offer.popular ? 'ring-2 ring-[#B600A8]/70' : ''}`}
            >
              <div className="flex flex-col w-full h-full p-7 sm:p-8 text-[#D7E2EA]">
                <div className="flex items-center justify-between gap-3 min-h-[34px]">
                  <h3 className="font-semibold uppercase tracking-wider text-lg sm:text-xl">{offer.name}</h3>
                  {offer.popular && (
                    <span
                      className="rounded-full text-white text-[11px] font-medium uppercase tracking-widest px-3 py-1.5 whitespace-nowrap"
                      style={PILL_GRADIENT_STYLE}
                    >
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-3 font-light text-sm sm:text-base opacity-70 leading-relaxed">{offer.tagline}</p>

                <div className="mt-8 flex items-end gap-1">
                  <span className="text-2xl font-medium opacity-80 mb-2">$</span>
                  <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(3rem, 5vw, 4.2rem)' }}>
                    {offer.price}
                  </span>
                </div>

                <ul className="mt-8 flex flex-col gap-3.5">
                  {offer.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 font-light text-sm sm:text-base leading-snug">
                      <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#d946ef]" strokeWidth={2.4} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-auto block text-center rounded-full font-medium uppercase tracking-widest text-sm py-3.5 transition-colors duration-200 ${
                    offer.popular ? 'text-white' : 'border-2 border-[#D7E2EA] hover:bg-[#D7E2EA]/10'
                  }`}
                  style={offer.popular ? PILL_GRADIENT_STYLE : undefined}
                >
                  Get started
                </a>
              </div>
            </PixelCard>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
