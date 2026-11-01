import ProductCard from '@/components/product/ProductCard';
import WordReveal from '@/components/shared/WordReveal';
import ShopCategories from '@/components/product/ShopCategories';
import { apiUrl } from '@/lib/api';

async function getProducts() {
  const res = await fetch(apiUrl('/api/products'), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch products from backend');
  }
  return res.json();
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
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
  const availableCategories = Array.from(new Set(formattedProducts.map((p) => p.category)));
  const initialCategory =
    resolvedSearchParams?.category && availableCategories.includes(resolvedSearchParams.category)
      ? resolvedSearchParams.category
      : 'All';

  return (
    <div>
      <div className="bg-ink bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(94,26,23,0.85),transparent_70%)] border-y border-gold/20 text-ivory py-14 md:py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center max-w-2xl relative z-10">
          <span className="eyebrow mb-4 block animate-fade-in">
            Our Authentic Collection
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-medium mb-5 leading-[1.08]">
            <WordReveal text="Pure Spices for Your Kitchen" startDelay={80} highlight={['Pure']} />
          </h1>
          <p className="text-ivory-muted animate-fade-up" style={{ animationDelay: '500ms' }}>
            Explore our full range of traditionally processed, stone-ground, and hygienically packed spices — blended, ground, and whole.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <ShopCategories products={formattedProducts} initialCategory={initialCategory} />
      </div>
    </div>
  );
}