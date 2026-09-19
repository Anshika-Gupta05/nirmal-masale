'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../layout/CartProvider';

interface ProductSize {
  weight: string;
  price: number;
}

interface ProductProps {
  id: string;
  name: string;
  category: string;
  image: string;
  slug: string;
  sizes?: ProductSize[];
  weight?: string;
  price?: number;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const sizes = product.sizes && product.sizes.length > 0
    ? product.sizes
    : [{ weight: product.weight || 'Standard', price: product.price || 0 }];

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const currentSize = sizes[selectedSizeIndex] || sizes[0];
  const [justAdded, setJustAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const { addToCart } = useCart();

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      selectedSize: currentSize.weight,
      price: currentSize.price,
      quantity: 1,
      image: product.image,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="h-full bg-white rounded-2xl overflow-hidden border border-nirmal-dark/10 hover:border-nirmal-maroon/30 hover:shadow-lg transition-all duration-300 flex flex-col group relative">

      {/* Image block — edge to edge, catalog style */}
      <Link href={`/shop/${product.slug}`} className="relative w-full aspect-[4/5] bg-[#FBF3E7] overflow-hidden block shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-6 group-hover:scale-110 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Category tag */}
        <span className="absolute top-2.5 left-2.5 bg-white/95 text-nirmal-maroon text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold z-10 shadow-sm">
          {product.category}
        </span>

        {/* Wishlist heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWishlisted((v) => !v);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 shadow-sm flex items-center justify-center z-10 hover:scale-110 active:scale-95 transition-transform"
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill={wishlisted ? '#D62828' : 'none'}
            stroke={wishlisted ? '#D62828' : '#7A2420'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={wishlisted ? 'animate-pop' : ''}
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
        </button>

        {/* Desktop hover slide-up: ADD TO BAG */}
        <button
          onClick={handleAddToCart}
          className={`hidden sm:flex absolute inset-x-0 bottom-0 items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 translate-y-full group-hover:translate-y-0 ${
            justAdded ? 'bg-emerald-600 text-white' : 'bg-nirmal-maroon text-nirmal-cream hover:bg-nirmal-maroon-dark'
          }`}
        >
          {justAdded ? (
            'Added to Bag ✓'
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              Add to Bag
            </>
          )}
        </button>
      </Link>

      {/* Content — fixed structure so every card lines up regardless of size count */}
      <div className="p-3.5 flex flex-col flex-grow">
        <Link href={`/shop/${product.slug}`} className="block">
          <p className="text-[10px] uppercase tracking-wider font-bold text-nirmal-dark/50 mb-0.5">
            Nirmal Masale
          </p>
          <h3 className="text-sm font-semibold text-nirmal-dark leading-snug line-clamp-2 mb-2.5 group-hover:text-nirmal-maroon transition-colors min-h-[2.6em]">
            {product.name}
          </h3>
        </Link>

        {/* Quantity row — ALWAYS visible. Interactive pills when there's a choice,
            a plain badge when there's only one pack size, so every card shows a
            weight and every card reserves the same vertical space. */}
        <div className="flex items-center gap-1.5 mb-3 min-h-[26px] overflow-x-auto no-scrollbar">
          {sizes.length > 1 ? (
            sizes.map((size, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSizeIndex(index);
                }}
                className={`text-[10px] px-2 py-1 rounded-md border font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedSizeIndex === index
                    ? 'bg-nirmal-maroon text-white border-nirmal-maroon'
                    : 'bg-transparent text-nirmal-dark/70 border-nirmal-dark/15 hover:border-nirmal-maroon'
                }`}
              >
                {size.weight}
              </button>
            ))
          ) : (
            <span className="text-[10px] px-2 py-1 rounded-md border border-nirmal-dark/15 text-nirmal-dark/60 font-medium whitespace-nowrap">
              {currentSize.weight}
            </span>
          )}
        </div>

        {/* Price + Add — price always paired with its quantity label */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2 border-t border-nirmal-dark/5">
          <span className="font-serif text-lg font-bold text-nirmal-maroon">
            ₹{currentSize.price}
          </span>

          {/* Mobile-visible add button (no hover on touch devices) */}
          <button
            onClick={handleAddToCart}
            className={`sm:hidden font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 cursor-pointer ${
              justAdded ? 'bg-emerald-600 text-white' : 'bg-nirmal-cta text-nirmal-cream hover:bg-nirmal-cta-hover'
            }`}
          >
            {justAdded ? 'Added ✓' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}