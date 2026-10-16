import FlexCarousel, { type FlexCarouselItem } from './FlexCarousel';

const BASE = 'https://motionsites.ai/assets/';
const IMAGES = [
  'hero-space-voyage-preview-eECLH3Yc.gif',
  'hero-codenest-preview-Cgppc2qV.gif',
  'hero-vex-ventures-preview-BczMFIiw.gif',
  'hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'hero-asme-preview-B_nGDnTP.gif',
  'hero-transform-data-preview-Cx5OU29N.gif',
  'hero-vitara-preview-Cjz2QYyU.gif',
  'hero-terra-preview-BFjrCr7T.gif',
  'hero-skyelite-preview-DHaZIgUv.gif',
  'hero-aethera-preview-DknSlcTa.gif',
  'hero-designpro-preview-D8c5_een.gif',
  'hero-stellar-ai-preview-D3HL6bw1.gif',
  'hero-xportfolio-preview-D4A8maiC.gif',
  'hero-orbit-web3-preview-BXt4OttD.gif',
  'hero-nexora-preview-cx5HmUgo.gif',
  'hero-evr-ventures-preview-DZxeVFEX.gif',
  'hero-planet-orbit-preview-DWAP8Z1P.gif',
  'hero-new-era-preview-CocuDUm9.gif',
  'hero-wealth-preview-B70idl_u.gif',
  'hero-luminex-preview-CxOP7ce6.gif',
  'hero-celestia-preview-0yO3jXO8.gif',
].map((f) => BASE + f);

const ITEMS: FlexCarouselItem[] = IMAGES.map((src) => {
  const slug = src.split('/').pop()!.replace(/^hero-/, '').replace(/-preview.*$/, '');
  const title = slug
    .split('-')
    .map((w) => (w === 'ai' ? 'AI' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
  return { src, alt: `${title} website preview`, title };
});

export default function MarqueeSection() {
  return (
    <section className="pt-24 sm:pt-32 md:pt-40 pb-10" style={{ background: '#0C0C0C' }}>
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
          autoplay
        />
      </div>
    </section>
  );
}
