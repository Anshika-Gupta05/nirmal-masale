import HeritageSection from '@/components/heritage/HeritageSection';
import Link from 'next/link';

const STATS = [
  { value: '23+', label: 'Years of Legacy' },
  { value: '50+', label: 'Spice Varieties' },
  { value: 'Lakhs', label: 'of Happy Households' },
  { value: '100%', label: 'Pure & Additive-Free' },
];

export default function HeritagePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner for Heritage */}
      <section className="bg-nirmal-cream text-nirmal-dark py-16 md:py-20 text-center border-b border-nirmal-maroon/20">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="text-nirmal-maroon tracking-widest uppercase text-xs font-semibold mb-3 block">
            The Story of Purity
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            A Quarter Century of Uncompromising Quality
          </h1>
          <p className="text-nirmal-dark/70 leading-relaxed">
            From humble beginnings in Dehradun in 2001 to becoming a trusted name in Indian households, discover the tradition, care, and craftsmanship behind every Nirmal Gold spice pouch.
          </p>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-white border-b border-nirmal-maroon/10">
        <div className="container mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-bold text-nirmal-maroon">{stat.value}</p>
              <p className="text-xs text-nirmal-dark/60 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Heritage Narrative Section */}
      <HeritageSection />

      {/* Our Craft — Product Range */}
      <section className="py-20 bg-white border-b border-nirmal-maroon/10">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="text-nirmal-maroon tracking-widest uppercase text-xs font-semibold mb-3 block">
            Our Craft
          </span>
          <h2 className="font-serif text-3xl font-bold text-nirmal-dark mb-6">
            Traditional Technique, Modern Precision
          </h2>
          <p className="text-nirmal-dark/80 leading-relaxed text-lg mb-12">
            Our manufacturing process blends time-tested spice-making traditions with modern equipment and hygiene standards — ensuring the true essence of every spice, from the earthy richness of turmeric to the fiery zest of red chilli, is preserved from farm to pouch.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="bg-[#FBF3E7] p-6 rounded-xl border border-nirmal-maroon/10">
              <div className="w-12 h-12 rounded-full bg-nirmal-maroon/10 text-nirmal-maroon flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-nirmal-dark mb-1.5">Grounded Spices</h3>
              <p className="text-sm text-nirmal-dark/70">
                Stone-ground powders like turmeric, chilli, and coriander — processed at low heat to protect natural oils and colour.
              </p>
            </div>
            <div className="bg-[#FBF3E7] p-6 rounded-xl border border-nirmal-maroon/10">
              <div className="w-12 h-12 rounded-full bg-nirmal-maroon/10 text-nirmal-maroon flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h18" /><path d="M5 12a7 7 0 0 1 14 0" /><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-nirmal-dark mb-1.5">Blended Masalas</h3>
              <p className="text-sm text-nirmal-dark/70">
                Carefully balanced spice blends like garam masala and chana masala, true to authentic Indian cooking.
              </p>
            </div>
            <div className="bg-[#FBF3E7] p-6 rounded-xl border border-nirmal-maroon/10">
              <div className="w-12 h-12 rounded-full bg-nirmal-maroon/10 text-nirmal-maroon flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2c4 3 6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 2-7 6-10Z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-bold text-nirmal-dark mb-1.5">Whole Seeds</h3>
              <p className="text-sm text-nirmal-dark/70">
                Farm-fresh whole spices and seeds, cleaned and graded for freshness that lasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Quality Promise Section */}
      <section className="py-20 container mx-auto px-6 max-w-4xl text-center">
        <h2 className="font-serif text-3xl font-bold text-nirmal-dark mb-6">
          The Commitment to Clean Processing
        </h2>
        <p className="text-nirmal-dark/80 leading-relaxed text-lg mb-8">
          We believe that real taste comes from preserving the natural oils of the spice. By combining strict hygienic packaging standards with time-tested stone-grinding principles, we ensure that what reaches your kitchen retains its authentic aroma and purity.
        </p>
        <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
          <div className="bg-white p-6 rounded-xl border border-nirmal-maroon/10 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-serif text-xl font-bold text-nirmal-maroon mb-2">Sourced with Care</h3>
            <p className="text-sm text-nirmal-dark/70">
              Raw spices are selected directly from prime agricultural regions, ensuring only the finest harvest makes the cut.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-nirmal-maroon/10 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-serif text-xl font-bold text-nirmal-maroon mb-2">Hygienic Packaging</h3>
            <p className="text-sm text-nirmal-dark/70">
              Every batch is sealed securely in food-grade pouches to protect against moisture and preserve absolute freshness.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-nirmal-maroon/10 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-serif text-xl font-bold text-nirmal-maroon mb-2">Traditional Stone-Grinding</h3>
            <p className="text-sm text-nirmal-dark/70">
              Low-heat grinding methods protect the essential oils that give each spice its signature aroma and depth.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-nirmal-maroon/10 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-serif text-xl font-bold text-nirmal-maroon mb-2">Rooted in Uttarakhand</h3>
            <p className="text-sm text-nirmal-dark/70">
              Proudly based in Dehradun, we bring the authentic flavours of the region to kitchens across the country.
            </p>
          </div>
        </div>

        <div className="mt-14">
          <Link
            href="/shop"
            className="inline-block bg-nirmal-maroon text-nirmal-cream font-semibold px-8 py-4 rounded-xl hover:bg-nirmal-maroon-dark hover:-translate-y-0.5 transition-all shadow-md"
          >
            Shop Our Collection
          </Link>
        </div>
      </section>
    </div>
  );
}