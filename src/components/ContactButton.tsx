import { ArrowUpRight } from 'lucide-react';

const GRADIENT = 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)';

export const PILL_GRADIENT_STYLE = {
  background: GRADIENT,
  boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
  outline: '2px solid white',
  outlineOffset: '-3px',
};

// Pill with a spinning gradient ring, a light sweep on hover and an arrow that turns toward the click.
export default function ContactButton() {
  return (
    <button className="contact-btn group relative inline-flex rounded-full p-[2px] transition-transform duration-300 hover:scale-[1.04] active:scale-[0.98]">
      <span aria-hidden className="contact-btn-ring absolute inset-0 rounded-full" />
      <span aria-hidden className="contact-btn-glow absolute -inset-1 rounded-full" />
      <span
        className="relative flex items-center gap-3 sm:gap-4 overflow-hidden rounded-full pl-6 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2"
        style={{ background: GRADIENT, boxShadow: '4px 4px 12px #7721B1 inset' }}
      >
        <span aria-hidden className="contact-btn-shine absolute inset-y-0 -left-1/2 w-1/3" />
        <span className="relative text-white font-medium uppercase tracking-widest text-xs sm:text-sm md:text-base">
          Contact Me
        </span>
        <span className="relative grid place-items-center rounded-full bg-white text-[#7621B0] w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 transition-transform duration-300 group-hover:rotate-45">
          <ArrowUpRight size={20} strokeWidth={2.4} />
        </span>
      </span>
    </button>
  );
}
