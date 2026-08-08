import ProductCard from '@/components/product/ProductCard';
import ShopCategories from '@/components/product/ShopCategories';

async function getProducts() {
  const res = await fetch('http://127.0.0.1:8000/api/products', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch products from backend');
  }
  return res.json();
}

export default async function ShopPage() {
  const response = await getProducts();
  const dbProducts = response.data || [];

  const groupedMap = new Map();

  dbProducts.forEach((product: any) => {
    const name = product.name;
    
    if (!groupedMap.has(name)) {
      const baseSlug = product.slug || name.toLowerCase().replace(/\s+/g, '-');
      
      groupedMap.set(name, {
        id: product.id || baseSlug, 
        name: name,
        category: product.category || 'Blended Spices', // Preserves database category!
        slug: baseSlug,
        image: product.image_url || product.image,
        sizes: [], 
      });
    }
    
    const existingProduct = groupedMap.get(name);

    if (product.sizes && Array.isArray(product.sizes)) {
      product.sizes.forEach((s: any) => {
        const exists = existingProduct.sizes.some((item: any) => item.weight === s.weight);
        if (!exists) {
          existingProduct.sizes.push({ weight: s.weight, price: s.price });
        }
      });
    } else {
      const weight = product.weight || 'Standard';
      const price = product.price || 0;
      const exists = existingProduct.sizes.some((item: any) => item.weight === weight);
      if (!exists) {
        existingProduct.sizes.push({ weight, price });
      }
    }
  });

  groupedMap.forEach((product) => {
    if (product.sizes.length === 0) {
      product.sizes.push({ weight: 'Standard', price: 0 });
    }
    product.sizes.sort((a: any, b: any) => a.price - b.price);
  });

  const formattedProducts = Array.from(groupedMap.values());

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <span className="text-nirmal-maroon tracking-widest uppercase text-xs font-semibold mb-2 block">
          Our Authentic Collection
        </span>
        <h1 className="font-serif text-4xl font-bold text-nirmal-dark mb-4">
          Pure Spices for Your Kitchen
        </h1>
        <p className="text-nirmal-dark/70">
          Explore our full range of traditionally processed, stone-ground, and hygienically packed spices fetched directly from our database.
        </p>
      </div>

      <ShopCategories products={formattedProducts} />
    </div>
  );
}