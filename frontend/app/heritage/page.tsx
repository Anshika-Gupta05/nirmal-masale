import HeritageSection from '@/components/heritage/HeritageSection';

export default function HeritagePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner for Heritage */}
      <section className="bg-nirmal-dark text-nirmal-cream py-16 text-center border-b border-nirmal-maroon/20">
        <div className="container mx-auto px-6 max-w-3xl">
          <span className="text-nirmal-gold tracking-widest uppercase text-xs font-semibold mb-3 block">
            The Story of Purity
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            A Quarter Century of Uncompromising Quality
          </h1>
          <p className="text-nirmal-cream/70 leading-relaxed">
            From humble beginnings in Dehradun in 2001 to becoming a trusted name in Indian households, discover the tradition, care, and craftsmanship behind every Nirmal Gold spice pouch.
          </p>
        </div>
      </section>

      {/* Main Heritage Narrative Section */}
      <HeritageSection />

      {/* Additional Quality Promise Section */}
      <section className="py-20 container mx-auto px-6 max-w-4xl text-center">
        <h2 className="font-serif text-3xl font-bold text-nirmal-dark mb-6">
          The Commitment to Clean Processing
        </h2>
        <p className="text-nirmal-dark/80 leading-relaxed text-lg mb-8">
          We believe that real taste comes from preserving the natural oils of the spice. By combining strict hygienic packaging standards with time-tested stone-grinding principles, we ensure that what reaches your kitchen retains its authentic aroma and purity.
        </p>
        <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
          <div className="bg-white p-6 rounded-xl border border-nirmal-maroon/10 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-nirmal-maroon mb-2">Sourced with Care</h3>
            <p className="text-sm text-nirmal-dark/70">
              Raw spices are selected directly from prime agricultural regions, ensuring only the finest harvest makes the cut.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-nirmal-maroon/10 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-nirmal-maroon mb-2">Hygienic Packaging</h3>
            <p className="text-sm text-nirmal-dark/70">
              Every batch is sealed securely in food-grade pouches to protect against moisture and preserve absolute freshness.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}