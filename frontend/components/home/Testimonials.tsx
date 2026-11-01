import ScrollReveal from '@/components/shared/ScrollReveal';

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
    <section className="py-20 md:py-28 bg-ink">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow mb-3 block">
            Loved By Home Cooks
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-ivory">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 110} className="h-full">
            <div
              className="relative h-full bg-surface rounded-2xl p-6 border border-gold/20 hover:border-gold/55 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.9)] transition-all duration-500 flex flex-col overflow-hidden"
            >
              <span aria-hidden="true" className="absolute -top-3 right-4 font-serif text-8xl leading-none text-gold/10 select-none">&ldquo;</span>
              <div className="flex gap-0.5 text-nirmal-gold mb-4" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-ivory/85 leading-relaxed mb-6 flex-grow relative">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gold/15">
                <div className="w-10 h-10 rounded-full bg-gold-soft text-ink flex items-center justify-center font-serif font-semibold shrink-0">
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ivory">{t.name}</p>
                  <p className="text-xs text-ivory-muted">{t.role}</p>
                </div>
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}