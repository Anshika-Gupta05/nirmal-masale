import HeritageSection from '@/components/heritage/HeritageSection';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

// Fetch data directly from your FastAPI backend
async function getFeaturedProducts() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/products', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    // Grab the first 3 products to feature on the homepage
    return data.status === 'success' ? data.data.slice(0, 3) : [];
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

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
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <span className="bg-nirmal-gold text-nirmal-dark text-xs px-4 py-1.5 rounded-full uppercase tracking-widest font-semibold inline-block mb-6">
            100% Pure & Stone Ground
          </span>
          
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Bring Royal Aroma & Authentic Taste to Your Kitchen
          </h1>
          
          <p className="text-lg md:text-xl text-nirmal-cream/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Crafted with passion since 2001. Experience the purity of traditional spices sourced directly from the finest origins and packed with care.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-nirmal-gold text-nirmal-dark font-semibold px-8 py-4 rounded-xl hover:bg-nirmal-gold/90 transition-all shadow-lg text-center"
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

      {/* Featured Products Section */}
      <section className="py-20 container mx-auto px-6">
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

        {/* Product Grid - Now Powered by Database! */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product: any, index: number) => (
              <ProductCard key={`${product.id}-${index}`} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-nirmal-dark/60">
              Loading featured spices...
            </div>
          )}
        </div>
      </section>

      {/* Heritage Narrative Section */}
      <HeritageSection />

    </div>
  );
}