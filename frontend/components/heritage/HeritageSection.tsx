import Image from 'next/image';

export default function HeritageSection() {
  return (
    <section className="py-24 bg-nirmal-maroon text-nirmal-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-spice-dots" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-nirmal-gold/10 blur-3xl animate-float" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-nirmal-turmeric/10 blur-3xl animate-float" style={{ animationDelay: '1.2s' }} />

      <div className="container mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-nirmal-gold tracking-widest uppercase text-sm font-semibold mb-3 block">
            Where Taste Meets Tradition
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-nirmal-cream">
            Since 2001: A Legacy of Flavour &amp; Trust
          </h2>
          <p className="text-nirmal-cream/80 text-lg">
            Rooted in Dehradun, Nirmal Masale has spent over two decades bringing uncompromised purity, authentic aroma, and traditional stone-ground perfection to every kitchen.
          </p>
        </div>

        {/* Founder Spotlight */}
        <div className="bg-nirmal-cream text-nirmal-dark rounded-2xl shadow-xl p-8 md:p-10 mb-14 grid md:grid-cols-[auto_1fr] gap-8 items-center max-w-4xl mx-auto">
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-nirmal-gold mx-auto shrink-0 shadow-md">
            <Image
              src="team/founder.png"
              alt="Mr. Sunil Kumar Gupta, MD & Founder of Nirmal Masale"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs uppercase tracking-widest font-semibold text-nirmal-maroon/70 mb-1">
              MD &amp; Founder
            </p>
            <h3 className="font-serif text-2xl font-bold text-nirmal-dark mb-3">
              Mr. Sunil Kumar Gupta
            </h3>
            <p className="text-sm text-nirmal-dark/70 leading-relaxed">
              In 2001, Mr. Gupta set out with a simple mission: bring purity, flavour, and quality to every household. That founding vision — sourcing honestly, processing hygienically, and never cutting corners on taste — still guides every batch that leaves the Nirmal Masale facility today.
            </p>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative mb-16">

          {/* Milestone 1 */}
          <div className="bg-nirmal-cream text-nirmal-dark p-8 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
            <span className="text-nirmal-maroon font-serif text-4xl font-bold block mb-4">2001</span>
            <h3 className="font-serif text-xl font-bold mb-3">The Foundation</h3>
            <p className="text-nirmal-dark/70 leading-relaxed text-sm">
              Started with a vision by Mr. Sunil Kumar Gupta to source, clean, and pack authentic spices without losing their natural essential oils.
            </p>
          </div>

          {/* Milestone 2 */}
          <div className="bg-nirmal-cream text-nirmal-dark p-8 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
            <span className="text-nirmal-maroon font-serif text-4xl font-bold block mb-4">Evolution</span>
            <h3 className="font-serif text-xl font-bold mb-3">Tradition Meets Technology</h3>
            <p className="text-nirmal-dark/70 leading-relaxed text-sm">
              Blended time-tested spice-making methods with modern manufacturing and hygienic packaging lines — preserving the true essence of every spice, batch after batch.
            </p>
          </div>

          {/* Milestone 3 */}
          <div className="bg-nirmal-cream text-nirmal-dark p-8 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
            <span className="text-nirmal-maroon font-serif text-4xl font-bold block mb-4">Today</span>
            <h3 className="font-serif text-xl font-bold mb-3">A Household Staple</h3>
            <p className="text-nirmal-dark/70 leading-relaxed text-sm">
              23+ years on, Nirmal Masale is a trusted name across ground spices, blended masalas, and whole seeds — proudly serving lakhs of homes under the Nirmal Gold banner.
            </p>
          </div>

        </div>

        {/* Tagline callout */}
        <div className="text-center">
          <p className="font-serif text-2xl md:text-3xl italic text-nirmal-gold">
            &ldquo;Nirmal Masale — Adding Flavour to Lives, Since 2001&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}