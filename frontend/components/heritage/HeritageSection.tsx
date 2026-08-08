export default function HeritageSection() {
  return (
    <section className="py-24 bg-nirmal-maroon text-nirmal-cream relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-nirmal-gold tracking-widest uppercase text-sm font-semibold mb-3 block">
            The Pure Tradition
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-nirmal-cream">
            Since 2001: A Legacy of Flavor & Trust
          </h2>
          <p className="text-nirmal-cream/80 text-lg">
            Rooted in Dehradun, Nirmal Masale has spent over two decades bringing uncompromised purity, authentic aroma, and traditional stone-ground perfection to every kitchen.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          
          {/* Milestone 1 */}
          <div className="bg-nirmal-cream/5 border border-nirmal-gold/20 p-8 rounded-xl backdrop-blur-sm transition-transform hover:-translate-y-1">
            <span className="text-nirmal-gold font-serif text-4xl font-bold block mb-4">2001</span>
            <h3 className="font-serif text-xl font-bold mb-3">The Foundation</h3>
            <p className="text-nirmal-cream/80 leading-relaxed text-sm">
              Started with a vision by Mr. Sunil Kumar Gupta to source, clean, and pack authentic spices without losing their natural essential oils.
            </p>
          </div>

          {/* Milestone 2 */}
          <div className="bg-nirmal-cream/5 border border-nirmal-gold/20 p-8 rounded-xl backdrop-blur-sm transition-transform hover:-translate-y-1">
            <span className="text-nirmal-gold font-serif text-4xl font-bold block mb-4">Evolution</span>
            <h3 className="font-serif text-xl font-bold mb-3">Purity & Hygiene Standards</h3>
            <p className="text-nirmal-cream/80 leading-relaxed text-sm">
              Integrated modern hygienic packaging lines while retaining traditional processing methods to ensure peak flavor in every single pouch.
            </p>
          </div>

          {/* Milestone 3 */}
          <div className="bg-nirmal-cream/5 border border-nirmal-gold/20 p-8 rounded-xl backdrop-blur-sm transition-transform hover:-translate-y-1">
            <span className="text-nirmal-gold font-serif text-4xl font-bold block mb-4">Today</span>
            <h3 className="font-serif text-xl font-bold mb-3">A Household Staple</h3>
            <p className="text-nirmal-cream/80 leading-relaxed text-sm">
              Proudly serving thousands of homes under the Nirmal Gold and Saviora Spices banners, trusted for uncompromising quality and royal taste.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}