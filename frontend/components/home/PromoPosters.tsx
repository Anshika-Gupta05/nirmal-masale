import Link from 'next/link';
import Image from 'next/image';

const POSTERS = [
  {
    title: 'Restaurant-Style\nGaram Masala',
    subtitle: 'The blend that defines authentic Indian cooking',
    cta: 'Shop Blended Spices',
    href: '/shop?category=Blended%20Spices',
    image: '/products/nirmal-gold-garam-masala-box.png',
    bg: 'from-nirmal-maroon-dark via-nirmal-maroon to-nirmal-maroon-light',
    text: 'text-nirmal-cream',
    subtext: 'text-nirmal-cream/75',
    badge: 'bg-nirmal-gold text-nirmal-maroon-dark',
    ctaClass: 'bg-nirmal-cta text-nirmal-cream hover:bg-nirmal-cta-hover',
  },
  {
    title: '100% Pure\nTurmeric Powder',
    subtitle: 'Rich colour, real aroma — no additives, ever',
    cta: 'Shop Ground Spices',
    href: '/shop?category=Ground%20Spices',
    image: '/products/nirmal-gold-haldi-powder-pouch.png',
    bg: 'from-nirmal-turmeric to-[#B87800]',
    text: 'text-nirmal-dark',
    subtext: 'text-nirmal-dark/70',
    badge: 'bg-nirmal-dark text-nirmal-cream',
    ctaClass: 'bg-nirmal-dark text-nirmal-cream hover:bg-black',
  },
  {
    title: 'Vibrant Colour,\nBold Heat',
    subtitle: 'Stone-ground red chilli powder, maximum punch',
    cta: 'Shop Now',
    href: '/shop?category=Ground%20Spices',
    image: '/products/nirmal-gold-red-chilli-powder-pouch.png',
    bg: 'from-nirmal-cta-hover to-nirmal-cta',
    text: 'text-nirmal-cream',
    subtext: 'text-nirmal-cream/80',
    badge: 'bg-nirmal-gold text-nirmal-maroon-dark',
    ctaClass: 'bg-nirmal-dark text-nirmal-cream hover:bg-black',
  },
];

export default function PromoPosters() {
  return (
    <section className="py-10 md:py-14 bg-nirmal-cream">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-5">
          {POSTERS.map((poster) => (
            <Link
              key={poster.title}
              href={poster.href}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${poster.bg} min-h-[300px] sm:min-h-[340px] flex flex-col justify-between p-7 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
            >
              {/* Decorative curved shape */}
              <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10" />
              <div className="absolute inset-0 opacity-[0.07] bg-spice-dots" />

              {/* Badge */}
              <span className={`relative z-10 inline-block w-fit ${poster.badge} text-[11px] px-3 py-1.5 rounded-full uppercase tracking-wider font-bold`}>
                Since 2001
              </span>

              {/* Text */}
              <div className="relative z-10">
                <h3 className={`font-serif text-3xl font-bold ${poster.text} mb-2 leading-tight whitespace-pre-line`}>
                  {poster.title}
                </h3>
                <p className={`${poster.subtext} text-sm mb-5 max-w-[220px]`}>
                  {poster.subtitle}
                </p>
                <span className={`inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl text-sm ${poster.ctaClass} transition-colors`}>
                  {poster.cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>

              {/* Big product image */}
              <div className="absolute right-2 bottom-0 w-32 sm:w-40 h-44 sm:h-56 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ease-out">
                <Image
                  src={poster.image}
                  alt={poster.title.replace('\n', ' ')}
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}