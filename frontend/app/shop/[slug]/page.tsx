import ProductDetailClient from './ProductDetailClient';

// 1. Fetch the specific product for the page
async function getProduct(slug: string) {
  try {
    // We add cache: 'no-store' so Next.js ALWAYS asks Python for the latest database info
    const res = await fetch(`http://127.0.0.1:8000/api/products/${slug}`, { 
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

// 2. Await the params to prevent modern Next.js warnings
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  // If the product truly isn't in the DB, show the error
  if (!product) {
    return (
      <div className="container mx-auto px-6 py-32 text-center font-serif text-xl text-nirmal-maroon">
        Product not found. (Tried to load: {resolvedParams.slug})
      </div>
    );
  }

  // Pass the server-fetched data down to the interactive client component
  return <ProductDetailClient dbProduct={product} />;
}