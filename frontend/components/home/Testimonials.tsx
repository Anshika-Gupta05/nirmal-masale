const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Home Cook, Delhi',
    quote:
      'The Garam Masala has such a fresh, rich aroma — it instantly lifts every curry I make. This is now a permanent fixture in my kitchen.',
    initial: 'P',
  },
  {
    name: 'Sarita Gupta',
    role: 'Home Cook, Dehradun',
    quote:
      'Their turmeric and chilli powders taste genuinely natural, not artificial. My whole family notices the difference in the food now.',
    initial: 'S',
  },
  {
    name: 'Meenu Chauhan',
    role: 'Home Cook, Haridwar',
    quote:
      'The coriander powder is so aromatic and fresh that it has become my everyday go-to. Cooking feels more flavourful with Nirmal.',
    initial: 'M',
  },
  {
    name: 'Priya Aggarwal',
    role: 'Home Cook, Meerut',
    quote:
      'What keeps me coming back is the consistency — every pack tastes just as rich and reliable as the last, batch after batch.',
    initial: 'P',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-[#f9f0e6]/50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-nirmal-maroon tracking-widest uppercase text-xs font-semibold mb-2 block">
            Loved By Home Cooks
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-nirmal-dark">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 shadow-sm border border-nirmal-maroon/10 flex flex-col"
            >
              <div className="flex gap-0.5 text-nirmal-gold mb-4" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-nirmal-dark/80 leading-relaxed mb-6 flex-grow">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-nirmal-dark/10">
                <div className="w-10 h-10 rounded-full bg-nirmal-maroon text-nirmal-cream flex items-center justify-center font-serif font-bold shrink-0">
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-bold text-nirmal-dark">{t.name}</p>
                  <p className="text-xs text-nirmal-dark/50">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}