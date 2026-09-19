import ProductDetailClient from './ProductDetailClient';
import { apiUrl } from '@/lib/api';

// 1. Fetch the specific product for the page
async function getProduct(slug: string) {
  try {
    // We add cache: 'no-store' so Next.js ALWAYS asks Python for the latest database info
    const res = await fetch(apiUrl(`/api/products/${slug}`), {
      cache: 'no-store'
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.status === 'success' ? data.data : null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// 2. Fetch related products from the same category
async function getRelatedProducts(category: string, excludeSlug: string) {
  try {
    const res = await fetch(apiUrl('/api/products'), { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'success') return [];

    return data.data
      .filter((p: any) => p.category === category && p.slug !== excludeSlug)
      .slice(0, 4);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

// 3. Await the params to prevent modern Next.js warnings
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  // If the product truly isn't in the DB, show the error
  if (!product) {
    return (
      <div className="container mx-auto px-6 py-32 text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-nirmal-maroon/10 flex items-center justify-center mx-auto mb-5">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-nirmal-maroon" strokeWidth="1.7">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl font-bold text-nirmal-dark mb-3">Product not found</h1>
        <p className="text-nirmal-dark/60 text-sm mb-8">
          We couldn&apos;t find &ldquo;{resolvedParams.slug}&rdquo; in our catalog. It may have been renamed or is out of stock.
        </p>
        <a href="/shop" className="inline-block bg-nirmal-maroon text-nirmal-cream font-semibold px-6 py-3 rounded-xl hover:bg-nirmal-maroon-dark transition-colors">
          Browse All Spices
        </a>
      </div>
    );
  }

  const relatedProducts = await getRelatedProducts(product.category, product.slug);

  // Pass the server-fetched data down to the interactive client component
  return <ProductDetailClient dbProduct={product} relatedProducts={relatedProducts} />;
}