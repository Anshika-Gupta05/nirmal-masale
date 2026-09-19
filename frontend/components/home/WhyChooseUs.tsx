const POINTS = [
  {
    title: 'Quality Assurance',
    desc: 'Every batch is checked to be pure, fresh and free from artificial additives.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 12 2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    title: 'Hygiene Standards',
    desc: 'Cleaned, processed and packed in a hygienic facility to protect taste and safety.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v6" />
        <path d="M8 4h8" />
        <path d="M5 10h14l-1.5 9a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2L5 10Z" />
      </svg>
    ),
  },
  {
    title: 'Wide Variety',
    desc: 'Ground, blended or whole — there is a stone-ground spice for every recipe.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    title: 'Customer Trust',
    desc: 'Over two decades of legacy, built on the love and trust of lakhs of homes.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20 bg-white border-y border-nirmal-maroon/10">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-nirmal-maroon tracking-widest uppercase text-xs font-semibold mb-2 block">
            Why Nirmal Masale
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-nirmal-dark">
            Why Choose Us?
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {POINTS.map((point) => (
            <div key={point.title} className="text-center px-2">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-nirmal-gold/15 text-nirmal-maroon flex items-center justify-center rotate-3 hover:rotate-0 transition-transform">
                {point.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-nirmal-dark mb-2">{point.title}</h3>
              <p className="text-sm text-nirmal-dark/65 leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}