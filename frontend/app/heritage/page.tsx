import HeritageSection from '@/components/heritage/HeritageSection';
import Link from 'next/link';
import ScrollReveal from '@/components/shared/ScrollReveal';
import CountUp from '@/components/shared/CountUp';
import WordReveal from '@/components/shared/WordReveal';

const STATS: { n?: number; suffix?: string; text?: string; label: string }[] = [
  { n: 23, suffix: '+', label: 'Years of Legacy' },
  { n: 50, suffix: '+', label: 'Spice Varieties' },
  { text: 'Lakhs', label: 'of Happy Households' },
  { n: 100, suffix: '%', label: 'Pure & Additive-Free' },
];

export default function HeritagePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner for Heritage */}
      <section className="relative overflow-hidden bg-ink bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(184,146,74,0.16),transparent_70%)] text-ivory py-20 md:py-28 text-center border-b border-gold/25">
        <div className="absolute -top-24 left-[10%] w-96 h-96 rounded-full bg-gold/10 blur-3xl animate-drift pointer-events-none" />
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="eyebrow mb-5 block animate-fade-in">
            The Story of Purity
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-medium mb-6 leading-[1.08]">
            <WordReveal text="A Quarter Century of Uncompromising Quality" startDelay={100} highlight={['Uncompromising']} />
          </h1>
          <p className="text-ivory-muted leading-relaxed text-lg animate-fade-up" style={{ animationDelay: '600ms' }}>
            From humble beginnings in Dehradun in 2001 to becoming a trusted name in Indian households, discover the tradition, care, and craftsmanship behind every Nirmal Gold spice pouch.
          </p>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-surface border-b border-gold/20">
        <div className="container mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100} variant="fade">
              <div className="text-center">
                <p className="font-serif text-4xl md:text-5xl font-medium text-gold-shimmer">
                  {stat.n !== undefined ? <CountUp value={stat.n} suffix={stat.suffix} /> : stat.text}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-ivory-muted mt-2">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Main Heritage Narrative Section */}
      <HeritageSection />

      {/* Our Craft — Product Range */}
      <section className="py-20 bg-ink border-b border-gold/20">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="eyebrow mb-4 block">
            Our Craft
          </span>
          <h2 className="font-serif text-3xl font-semibold text-ivory mb-6">
            Traditional Technique, Modern Precision
          </h2>
          <p className="text-ivory-muted leading-relaxed text-lg mb-12">
            Our manufacturing process blends time-tested spice-making traditions with modern equipment and hygiene standards — ensuring the true essence of every spice, from the earthy richness of turmeric to the fiery zest of red chilli, is preserved from farm to pouch.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <ScrollReveal delay={0} className="h-full">
            <div className="bg-surface-2 p-6 rounded-xl border border-gold/20 hover:border-gold/55 hover:-translate-y-1 transition-all duration-500 h-full">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 text-gold-soft flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-semibold text-ivory mb-1.5">Grounded Spices</h3>
              <p className="text-sm text-ivory-muted">
                Stone-ground powders like turmeric, chilli, and coriander — processed at low heat to protect natural oils and colour.
              </p>
            </div>
            </ScrollReveal>
            <ScrollReveal delay={120} className="h-full">
            <div className="bg-surface-2 p-6 rounded-xl border border-gold/20 hover:border-gold/55 hover:-translate-y-1 transition-all duration-500 h-full">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 text-gold-soft flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h18" /><path d="M5 12a7 7 0 0 1 14 0" /><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-semibold text-ivory mb-1.5">Blended Masalas</h3>
              <p className="text-sm text-ivory-muted">
                Carefully balanced spice blends like garam masala and chana masala, true to authentic Indian cooking.
              </p>
            </div>
            </ScrollReveal>
            <ScrollReveal delay={240} className="h-full">
            <div className="bg-surface-2 p-6 rounded-xl border border-gold/20 hover:border-gold/55 hover:-translate-y-1 transition-all duration-500 h-full">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 text-gold-soft flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2c4 3 6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 2-7 6-10Z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-semibold text-ivory mb-1.5">Whole Seeds</h3>
              <p className="text-sm text-ivory-muted">
                Farm-fresh whole spices and seeds, cleaned and graded for freshness that lasts.
              </p>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Additional Quality Promise Section */}
      <section className="py-20 container mx-auto px-6 max-w-4xl text-center">
        <h2 className="font-serif text-3xl font-semibold text-ivory mb-6">
          The Commitment to Clean Processing
        </h2>
        <p className="text-ivory-muted leading-relaxed text-lg mb-8">
          We believe that real taste comes from preserving the natural oils of the spice. By combining strict hygienic packaging standards with time-tested stone-grinding principles, we ensure that what reaches your kitchen retains its authentic aroma and purity.
        </p>
        <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
          <ScrollReveal delay={0} className="h-full">
          <div className="bg-surface p-6 rounded-xl border border-gold/20 hover:border-gold/55 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.9)] transition-all duration-500">
            <h3 className="font-serif text-xl font-semibold text-gold-soft mb-2">Sourced with Care</h3>
            <p className="text-sm text-ivory-muted">
              Raw spices are selected directly from prime agricultural regions, ensuring only the finest harvest makes the cut.
            </p>
          </div>
          </ScrollReveal>
          <ScrollReveal delay={120} className="h-full">
          <div className="bg-surface p-6 rounded-xl border border-gold/20 hover:border-gold/55 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.9)] transition-all duration-500">
            <h3 className="font-serif text-xl font-semibold text-gold-soft mb-2">Hygienic Packaging</h3>
            <p className="text-sm text-ivory-muted">
              Every batch is sealed securely in food-grade pouches to protect against moisture and preserve absolute freshness.
            </p>
          </div>
          </ScrollReveal>
          <ScrollReveal delay={0} className="h-full">
          <div className="bg-surface p-6 rounded-xl border border-gold/20 hover:border-gold/55 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.9)] transition-all duration-500">
            <h3 className="font-serif text-xl font-semibold text-gold-soft mb-2">Traditional Stone-Grinding</h3>
            <p className="text-sm text-ivory-muted">
              Low-heat grinding methods protect the essential oils that give each spice its signature aroma and depth.
            </p>
          </div>
          </ScrollReveal>
          <ScrollReveal delay={120} className="h-full">
          <div className="bg-surface p-6 rounded-xl border border-gold/20 hover:border-gold/55 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.9)] transition-all duration-500">
            <h3 className="font-serif text-xl font-semibold text-gold-soft mb-2">Rooted in Uttarakhand</h3>
            <p className="text-sm text-ivory-muted">
              Proudly based in Dehradun, we bring the authentic flavours of the region to kitchens across the country.
            </p>
          </div>
          </ScrollReveal>
        </div>

        <div className="mt-14">
          <Link
            href="/shop"
            className="inline-block btn-sheen bg-gold-soft text-ink font-semibold px-9 py-4 text-[12px] uppercase tracking-[0.22em] hover:bg-ivory hover:-translate-y-0.5 transition-all"
          >
            Shop Our Collection
          </Link>
        </div>
      </section>
    </div>
  );
}