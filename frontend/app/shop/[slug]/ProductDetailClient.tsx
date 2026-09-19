'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/layout/CartProvider';
import ProductCard from '@/components/product/ProductCard';

const TRUST_ITEMS = [
  { label: 'Free delivery over ₹300' },
  { label: 'Cash on delivery available' },
  { label: '100% pure, no additives' },
  { label: 'Secure checkout' },
];

export default function ProductDetailClient({
  dbProduct,
  relatedProducts = [],
}: {
  dbProduct: any;
  relatedProducts?: any[];
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'storage' | 'delivery'>('ingredients');
  const [justAdded, setJustAdded] = useState(false);

  // Handle sizes array from the grouped database
  const sizes = dbProduct.sizes || [{ weight: dbProduct.weight || 'Standard', price: dbProduct.price || 0 }];
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const currentSize = sizes[selectedSizeIndex];

  const handleAddToCart = () => {
    addToCart({
      id: String(dbProduct.id),
      name: dbProduct.name,
      selectedSize: currentSize.weight,
      price: currentSize.price,
      quantity: quantity,
      image: dbProduct.image_url,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="container mx-auto px-6 py-12 pb-28 lg:pb-12">

      {/* Breadcrumb Navigation */}
      <div className="text-sm text-nirmal-dark/60 mb-8">
        <Link href="/" className="hover:text-nirmal-maroon">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-nirmal-maroon">Shop</Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${encodeURIComponent(dbProduct.category)}`} className="hover:text-nirmal-maroon">
          {dbProduct.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-nirmal-maroon font-medium">{dbProduct.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">

        {/* Left: Product Image Showcase - PURE WHITE + BLEND MODE */}
        <div className="relative h-96 lg:h-[500px] bg-white border border-nirmal-maroon/10 rounded-2xl overflow-hidden flex items-center justify-center shadow-sm lg:sticky lg:top-24">
          <span className="absolute top-4 left-4 bg-white/90 text-nirmal-maroon text-xs px-3 py-1.5 rounded-full uppercase tracking-wider font-semibold z-10 border border-nirmal-maroon/10">
            {dbProduct.category}
          </span>
          <div className="relative w-full h-full">
            <Image
              src={dbProduct.image_url}
              alt={dbProduct.name}
              fill
              className="object-contain p-8 lg:p-12 mix-blend-multiply hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </div>

        {/* Right: Product Details & Actions */}
        <div className="flex flex-col">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-nirmal-dark mb-3">
            {dbProduct.name}
          </h1>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs bg-nirmal-gold/20 text-nirmal-dark px-3 py-1 rounded-md font-medium border border-nirmal-gold/30">
              Authentic Recipe
            </span>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-md font-medium border border-emerald-200">
              In Stock
            </span>
          </div>

          <p className="text-nirmal-dark/80 leading-relaxed mb-8 text-base">
            {dbProduct.description || `100% pure, hygienically packed ${dbProduct.name}, stone-ground the traditional way to lock in natural aroma and flavour.`}
          </p>

          {/* DYNAMIC SIZE SELECTOR PILLS */}
          <div className="mb-6">
            <label className="text-xs font-semibold uppercase tracking-wider text-nirmal-dark/70 block mb-2">
              Package Weight:
            </label>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedSizeIndex(index)}
                  className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm border cursor-pointer ${
                    selectedSizeIndex === index
                      ? 'bg-nirmal-maroon text-nirmal-cream border-nirmal-maroon'
                      : 'bg-transparent text-nirmal-dark border-nirmal-dark/20 hover:border-nirmal-maroon'
                  }`}
                >
                  {size.weight}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Quantity Row */}
          <div className="bg-white p-6 rounded-2xl border border-nirmal-maroon/10 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-nirmal-dark/60 block uppercase font-medium">Total Price</span>
              <span className="font-serif text-3xl font-bold text-nirmal-maroon">
                ₹{currentSize.price * quantity}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Quantity Counter */}
              <div className="flex items-center border border-nirmal-dark/20 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-nirmal-dark hover:bg-nirmal-maroon hover:text-nirmal-cream transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-2 font-semibold text-nirmal-dark text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-nirmal-dark hover:bg-nirmal-maroon hover:text-nirmal-cream transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                className={`flex-grow sm:flex-grow-0 font-semibold px-6 py-3 rounded-xl transition-all shadow-md text-sm cursor-pointer ${
                  justAdded ? 'bg-emerald-600 text-white' : 'bg-nirmal-cta text-nirmal-cream hover:bg-nirmal-cta-hover'
                }`}
              >
                {justAdded ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3">
            {TRUST_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-nirmal-dark/70 bg-white px-3 py-2.5 rounded-lg border border-nirmal-maroon/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-nirmal-maroon shrink-0" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m20 6-11 11-5-5" />
                </svg>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white border border-nirmal-maroon/10 rounded-2xl p-8 shadow-sm mb-16">
        <div className="flex border-b border-nirmal-dark/10 mb-6 gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-4 font-serif text-lg font-semibold transition-colors relative whitespace-nowrap cursor-pointer ${
              activeTab === 'ingredients'
                ? 'text-nirmal-maroon border-b-2 border-nirmal-maroon'
                : 'text-nirmal-dark/60 hover:text-nirmal-dark'
            }`}
          >
            Purity
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`pb-4 font-serif text-lg font-semibold transition-colors relative whitespace-nowrap cursor-pointer ${
              activeTab === 'storage'
                ? 'text-nirmal-maroon border-b-2 border-nirmal-maroon'
                : 'text-nirmal-dark/60 hover:text-nirmal-dark'
            }`}
          >
            Storage Instructions
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-4 font-serif text-lg font-semibold transition-colors relative whitespace-nowrap cursor-pointer ${
              activeTab === 'delivery'
                ? 'text-nirmal-maroon border-b-2 border-nirmal-maroon'
                : 'text-nirmal-dark/60 hover:text-nirmal-dark'
            }`}
          >
            Shipping &amp; Returns
          </button>
        </div>

        <div className="text-nirmal-dark/80 leading-relaxed text-base min-h-[80px]">
          {activeTab === 'ingredients' && <p>100% pure and authentic spices, stone-ground to preserve essential oils and natural aroma — no fillers or artificial colours added.</p>}
          {activeTab === 'storage' && <p>Store in a cool, dry place inside an airtight container immediately after opening to retain peak aroma and freshness for longer.</p>}
          {activeTab === 'delivery' && <p>Orders above ₹300 ship free across India. Cash on delivery is available in most pin codes. You can track your order anytime from the Track Order page once it&apos;s dispatched.</p>}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-nirmal-dark mb-8">
            You May Also Like
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard
                key={p.id || p.slug}
                product={{
                  id: String(p.id),
                  name: p.name,
                  category: p.category,
                  slug: p.slug,
                  image: p.image_url,
                  sizes: p.sizes,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sticky mobile add-to-cart bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-nirmal-maroon/10 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-nirmal-dark/50">Total</p>
          <p className="font-serif text-xl font-bold text-nirmal-maroon truncate">₹{currentSize.price * quantity}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className={`font-semibold px-6 py-3 rounded-xl text-sm shrink-0 transition-colors ${
            justAdded ? 'bg-emerald-600 text-white' : 'bg-nirmal-cta text-nirmal-cream hover:bg-nirmal-cta-hover'
          }`}
        >
          {justAdded ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}