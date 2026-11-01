import Image from 'next/image';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function HeritageSection() {
  return (
    <section className="py-24 bg-ink bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(94,26,23,0.85),transparent_70%)] border-y border-gold/20 text-ivory relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-nirmal-gold/10 blur-3xl animate-drift" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-nirmal-turmeric/10 blur-3xl animate-drift" style={{ animationDelay: '-7s' }} />

      <div className="container mx-auto px-6 relative z-10">

        {/* Section Header */}
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow mb-4 block">
            Where Taste Meets Tradition
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4 text-ivory">
            Since 2001: A Legacy of Flavour &amp; Trust
          </h2>
          <p className="text-ivory/80 text-lg">
            Rooted in Dehradun, Nirmal Masale has spent over two decades bringing uncompromised purity, authentic aroma, and traditional stone-ground perfection to every kitchen.
          </p>
        </ScrollReveal>

        {/* Founder Spotlight */}
        <ScrollReveal variant="scale" className="max-w-4xl mx-auto mb-14">
        <div className="bg-surface-2 border border-gold/30 hover:border-gold/60 transition-colors duration-500 text-ivory rounded-2xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] p-8 md:p-10 grid md:grid-cols-[auto_1fr] gap-8 items-center">
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-nirmal-gold mx-auto shrink-0 shadow-[0_0_0_6px_rgba(184,146,74,0.12),0_10px_30px_-10px_rgba(0,0,0,0.8)]">
            <Image
              src="/team/founder.png"
              alt="Mr. Sunil Kumar Gupta, MD & Founder of Nirmal Masale"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-soft mb-1 block">
              MD &amp; Founder
            </span>
            <h3 className="font-serif text-2xl font-semibold text-ivory mb-3">
              Mr. Sunil Kumar Gupta
            </h3>
            <p className="text-sm text-ivory/80 leading-relaxed">
              In 2001, Mr. Gupta set out with a simple mission: bring purity, flavour, and quality to every household. That founding vision — sourcing honestly, processing hygienically, and never cutting corners on taste — still guides every batch that leaves the Nirmal Masale facility today.
            </p>
          </div>
        </div>
        </ScrollReveal>

        {/* Timeline Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative mb-16 max-w-5xl mx-auto">

          {/* Milestone 1 */}
          <ScrollReveal delay={0} className="h-full">
          <div className="h-full bg-surface-2 border border-gold/30 hover:border-gold/60 text-ivory p-8 rounded-xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.8)] transition-all duration-500 hover:-translate-y-1.5">
            <span className="text-gold-shimmer font-serif text-4xl font-semibold block mb-4">2001</span>
            <h3 className="font-serif text-xl font-semibold mb-3 text-ivory">The Foundation</h3>
            <p className="text-ivory/80 leading-relaxed text-sm">
              Started with a vision by Mr. Sunil Kumar Gupta to source, clean, and pack authentic spices without losing their natural essential oils.
            </p>
          </div>
          </ScrollReveal>

          {/* Milestone 2 */}
          <ScrollReveal delay={140} className="h-full">
          <div className="h-full bg-surface-2 border border-gold/30 hover:border-gold/60 text-ivory p-8 rounded-xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.8)] transition-all duration-500 hover:-translate-y-1.5">
            <span className="text-gold-shimmer font-serif text-4xl font-semibold block mb-4">Evolution</span>
            <h3 className="font-serif text-xl font-semibold mb-3 text-ivory">Tradition Meets Technology</h3>
            <p className="text-ivory/80 leading-relaxed text-sm">
              Blended time-tested spice-making methods with modern manufacturing and hygienic packaging lines — preserving the true essence of every spice, batch after batch.
            </p>
          </div>
          </ScrollReveal>

          {/* Milestone 3 */}
          <ScrollReveal delay={280} className="h-full">
          <div className="h-full bg-surface-2 border border-gold/30 hover:border-gold/60 text-ivory p-8 rounded-xl shadow-[0_20px_50px_-24px_rgba(0,0,0,0.8)] transition-all duration-500 hover:-translate-y-1.5">
            <span className="text-gold-shimmer font-serif text-4xl font-semibold block mb-4">Today</span>
            <h3 className="font-serif text-xl font-semibold mb-3 text-ivory">A Household Staple</h3>
            <p className="text-ivory/80 leading-relaxed text-sm">
              23+ years on, Nirmal Masale is a trusted name across ground spices, blended masalas, and whole seeds — proudly serving lakhs of homes under the Nirmal Gold banner.
            </p>
          </div>
          </ScrollReveal>

        </div>

        {/* Tagline callout */}
        <ScrollReveal variant="fade" className="text-center">
          <p className="font-serif text-2xl md:text-3xl italic text-gold-shimmer">
            &ldquo;Nirmal Masale — Adding Flavour to Lives, Since 2001&rdquo;
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}