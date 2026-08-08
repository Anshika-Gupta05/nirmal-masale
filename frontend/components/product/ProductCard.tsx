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
  // Fallback support if sizes array is missing
  const sizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : [{ weight: product.weight || 'Standard', price: product.price || 0 }];

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const currentSize = sizes[selectedSizeIndex] || sizes[0];
  
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      selectedSize: currentSize.weight,
      price: currentSize.price,
      quantity: 1,
      image: product.image,
    });
  };

  return (
    <div className="bg-white border border-nirmal-maroon/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
      
      {/* PURE WHITE BACKGROUND - TRANSPARENT PNG */}
      <div className="relative w-full aspect-square bg-white overflow-hidden p-6 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <span className="absolute top-3 left-3 bg-white/90 text-nirmal-maroon text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold z-10 border border-nirmal-maroon/10">
          {product.category}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-serif text-xl font-bold text-nirmal-dark hover:text-nirmal-maroon transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Size Selector Pills */}
        <div className="mb-4">
          <p className="text-xs text-nirmal-dark/60 mb-1.5 uppercase font-medium">Select Size:</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, index) => (
              <button
                key={index} 
                onClick={() => setSelectedSizeIndex(index)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
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

        {/* Price & Action Row */}
        <div className="mt-auto pt-4 border-t border-nirmal-dark/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-nirmal-dark/60 block">Price</span>
            <span className="font-serif text-2xl font-bold text-nirmal-maroon">
              ₹{currentSize.price}
            </span>
          </div>

          <button 
            onClick={handleAddToCart}
            className="bg-nirmal-cta text-nirmal-cream font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-nirmal-cta/90 transition-colors shadow-sm"
          >
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
}