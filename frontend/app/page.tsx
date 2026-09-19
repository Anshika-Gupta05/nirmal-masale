import HeritageSection from '@/components/heritage/HeritageSection';
import ProductCard from '@/components/product/ProductCard';
import CategoryTiles from '@/components/home/CategoryTiles';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import MarqueeTicker from '@/components/home/MarqueeTicker';
import ScrollReveal from '@/components/shared/ScrollReveal';
import Link from 'next/link';
import { apiUrl } from '@/lib/api';

// Fetch data directly from your FastAPI backend
async function getFeaturedProducts() {
  try {
    const res = await fetch(apiUrl('/api/products'), { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    // Grab the first 3 products to feature on the homepage
    return data.status === 'success' ? data.data.slice(0, 3) : [];
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

const TRUST_BADGES = [
  { label: '100% Pure', sub: 'No fillers, no artificial colour' },
  { label: 'Stone-Ground', sub: 'Traditional grinding, retained oils' },
  { label: 'Since 2001', sub: 'Two decades of trust' },
  { label: 'Free Delivery', sub: 'On orders above ₹300' },
];

export default async function Home() {
  const dbProducts = await getFeaturedProducts();

  // Format the database records to match the updated grouped sizes structure
  const featuredProducts = dbProducts.map((product: any) => ({
    id: String(product.id),
    name: product.name,
    category: product.category,
    slug: product.slug,
    image: product.image_url,
    sizes: product.sizes || [{ weight: product.weight || 'Standard', price: product.price || 0 }],
  }));

  return (
    <div className="flex flex-col flex-grow">

      {/* Hero Section */}
      <section className="relative bg-nirmal-maroon text-nirmal-cream py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-spice-dots" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-nirmal-gold/10 blur-3xl animate-float" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-nirmal-turmeric/10 blur-3xl animate-float" style={{ animationDelay: '1.2s' }} />

        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <span className="bg-nirmal-gold text-nirmal-maroon-dark text-xs px-4 py-1.5 rounded-full uppercase tracking-widest font-semibold inline-block mb-6 animate-fade-up">
            100% Pure &amp; Stone Ground
          </span>

          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-up" style={{ animationDelay: '100ms' }}>
            Bring Royal Aroma &amp; Authentic Taste to Your Kitchen
          </h1>

          <p className="text-lg md:text-xl text-nirmal-cream/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '180ms' }}>
            Crafted with passion since 2001. Experience the purity of traditional spices sourced directly from the finest origins and packed with care in Dehradun.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '260ms' }}>
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-nirmal-cta text-nirmal-cream font-semibold px-8 py-4 rounded-xl hover:bg-nirmal-cta-hover hover:-translate-y-0.5 transition-all shadow-lg text-center"
            >
              Explore Shop
            </Link>
            <Link
              href="/heritage"
              className="w-full sm:w-auto border border-nirmal-cream/30 text-nirmal-cream font-semibold px-8 py-4 rounded-xl hover:bg-nirmal-cream/10 transition-all text-center"
            >
              Our 2001 Legacy
            </Link>
          </div>
        </div>
      </section>

      {/* Gold Marquee Ticker */}
      <MarqueeTicker />

      {/* Trust Badges Strip */}
      <section className="bg-nirmal-cream border-b border-nirmal-maroon/10">
        <div className="container mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.label} className="text-center">
              <p className="font-serif text-nirmal-maroon font-bold text-lg">{badge.label}</p>
              <p className="text-xs text-nirmal-dark/50 mt-0.5">{badge.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Tiles */}
      <ScrollReveal>
        <CategoryTiles />
      </ScrollReveal>

      {/* Featured Products Section */}
      <section className="py-16 md:py-20 container mx-auto px-6">
        <ScrollReveal>
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div>
            <span className="text-nirmal-maroon tracking-widest uppercase text-xs font-semibold mb-2 block">
              Handpicked Quality
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-nirmal-dark">
              Featured Spices
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 text-nirmal-maroon font-semibold hover:underline flex items-center gap-2"
          >
            View All Products &rarr;
          </Link>
        </div>
        </ScrollReveal>

        {/* Product Grid - Now Powered by Database! */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product: any, index: number) => (
              <ScrollReveal key={`${product.id}-${index}`} delay={index * 100} className="h-full">
                <ProductCard product={product} />
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-full text-center py-16 px-6 bg-white border border-dashed border-nirmal-maroon/20 rounded-2xl text-nirmal-dark/60">
              <p className="font-serif text-lg mb-1">Spices are on their way to the shelf</p>
              <p className="text-sm">Couldn&apos;t reach the catalog right now — please check back shortly.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <ScrollReveal>
        <WhyChooseUs />
      </ScrollReveal>

      {/* Heritage Narrative Section */}
      <HeritageSection />

      {/* Testimonials */}
      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>

      {/* Newsletter / Social CTA */}
      <Newsletter />

    </div>
  );
}