import Link from 'next/link';

const CATEGORIES = [
  {
    name: 'Blended Spices',
    tagline: 'Masalas & mixes for every dish',
    href: '/shop?category=Blended%20Spices',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18" />
        <path d="M5 12a7 7 0 0 1 14 0" />
        <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
      </svg>
    ),
  },
  {
    name: 'Ground Spices',
    tagline: 'Stone-ground powders, pure & vibrant',
    href: '/shop?category=Ground%20Spices',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l3 2" />
      </svg>
    ),
  },
  {
    name: 'Whole Spices & Seeds',
    tagline: 'Farm-fresh seeds, whole & aromatic',
    href: '/shop?category=Whole%20Spices%20%26%20Seeds',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c4 3 6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 2-7 6-10Z" />
      </svg>
    ),
  },
  {
    name: 'Specialty Essentials',
    tagline: 'Salts, besan & everyday kitchen staples',
    href: '/shop?category=Specialty%20Essentials',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="7" width="16" height="13" rx="2" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      </svg>
    ),
  },
];

export default function CategoryTiles() {
  return (
    <section className="py-16 md:py-20 container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-nirmal-maroon tracking-widest uppercase text-xs font-semibold mb-2 block">
          Shop By Category
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-nirmal-dark">
          More Spices, More Flavour
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group bg-white border border-nirmal-maroon/10 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-nirmal-gold/50 transition-all duration-300"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-nirmal-maroon/10 text-nirmal-maroon flex items-center justify-center group-hover:bg-nirmal-maroon group-hover:text-nirmal-cream transition-colors duration-300">
              {cat.icon}
            </div>
            <h3 className="font-serif font-bold text-nirmal-dark mb-1 text-sm md:text-base">{cat.name}</h3>
            <p className="text-xs text-nirmal-dark/60 hidden sm:block">{cat.tagline}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}