'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

export default function ShopCategories({ products }: { products: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories dynamically from your database products, plus "All"
  const uniqueCategories = Array.from(new Set(products.map(p => p.category || 'Spices')));
  const categories = ['All', ...uniqueCategories];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => (p.category || 'Spices') === selectedCategory);

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm border ${
              selectedCategory === cat
                ? 'bg-nirmal-maroon text-white border-nirmal-maroon'
                : 'bg-white text-nirmal-dark border-nirmal-dark/10 hover:border-nirmal-maroon'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product: any, index: number) => (
          <ProductCard key={`${product.id}-${index}`} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-nirmal-dark/60 font-serif text-lg">
          No products found in this category.
        </div>
      )}
    </div>
  );
}