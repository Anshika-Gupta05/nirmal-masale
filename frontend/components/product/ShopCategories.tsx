'use client';

import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

const PRICE_BUCKETS = [
  { label: 'Under ₹50', min: 0, max: 50 },
  { label: '₹50 – ₹100', min: 50, max: 100 },
  { label: '₹100 – ₹200', min: 100, max: 200 },
  { label: 'Above ₹200', min: 200, max: Infinity },
];

export default function ShopCategories({
  products,
  initialCategory = 'All',
}: {
  products: any[];
  initialCategory?: string;
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory !== 'All' ? [initialCategory] : []
  );
  const [selectedPriceBuckets, setSelectedPriceBuckets] = useState<string[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const lowestPrice = (p: any) =>
    p.sizes && p.sizes.length > 0 ? Math.min(...p.sizes.map((s: any) => s.price)) : 0;

  const uniqueCategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category || 'Spices'))),
    [products]
  );

  const uniqueWeights = useMemo(() => {
    const w = new Set<string>();
    products.forEach((p) => (p.sizes || []).forEach((s: any) => w.add(s.weight)));
    return Array.from(w);
  }, [products]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    uniqueCategories.forEach((cat) => {
      counts[cat] = products.filter((p) => (p.category || 'Spices') === cat).length;
    });
    return counts;
  }, [products, uniqueCategories]);

  const toggle = (list: string[], value: string, setter: (v: string[]) => void) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedPriceBuckets([]);
    setSelectedWeights([]);
    setQuery('');
  };

  const activeFilterCount =
    selectedCategories.length + selectedPriceBuckets.length + selectedWeights.length;

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category || 'Spices'));
    }

    if (selectedPriceBuckets.length > 0) {
      result = result.filter((p) => {
        const price = lowestPrice(p);
        return selectedPriceBuckets.some((label) => {
          const bucket = PRICE_BUCKETS.find((b) => b.label === label)!;
          return price >= bucket.min && price < bucket.max;
        });
      });
    }

    if (selectedWeights.length > 0) {
      result = result.filter((p) =>
        (p.sizes || []).some((s: any) => selectedWeights.includes(s.weight))
      );
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    result = [...result];
    if (sort === 'price-asc') result.sort((a, b) => lowestPrice(a) - lowestPrice(b));
    if (sort === 'price-desc') result.sort((a, b) => lowestPrice(b) - lowestPrice(a));
    if (sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, selectedCategories, selectedPriceBuckets, selectedWeights, query, sort]);

  const sortLabel: Record<SortOption, string> = {
    featured: 'Featured',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'name-asc': 'Name: A to Z',
  };

  // --- Reusable filter panel (shared by desktop sidebar + mobile sheet) ---
  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-nirmal-dark text-lg">Filters</h3>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-xs font-semibold text-nirmal-cta hover:underline">
            Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-nirmal-dark/50 mb-3">Category</p>
        <div className="space-y-2.5">
          {uniqueCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group/cb">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggle(selectedCategories, cat, setSelectedCategories)}
                className="w-4 h-4 rounded accent-nirmal-maroon cursor-pointer"
              />
              <span className="text-sm text-nirmal-dark group-hover/cb:text-nirmal-maroon transition-colors flex-1">
                {cat}
              </span>
              <span className="text-xs text-nirmal-dark/40">({categoryCounts[cat]})</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-nirmal-dark/10" />

      {/* Price */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-nirmal-dark/50 mb-3">Price</p>
        <div className="space-y-2.5">
          {PRICE_BUCKETS.map((bucket) => (
            <label key={bucket.label} className="flex items-center gap-2.5 cursor-pointer group/cb">
              <input
                type="checkbox"
                checked={selectedPriceBuckets.includes(bucket.label)}
                onChange={() => toggle(selectedPriceBuckets, bucket.label, setSelectedPriceBuckets)}
                className="w-4 h-4 rounded accent-nirmal-maroon cursor-pointer"
              />
              <span className="text-sm text-nirmal-dark group-hover/cb:text-nirmal-maroon transition-colors">
                {bucket.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {uniqueWeights.length > 0 && (
        <>
          <div className="h-px bg-nirmal-dark/10" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-nirmal-dark/50 mb-3">Pack Size</p>
            <div className="flex flex-wrap gap-2">
              {uniqueWeights.map((w) => (
                <button
                  key={w}
                  onClick={() => toggle(selectedWeights, w, setSelectedWeights)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                    selectedWeights.includes(w)
                      ? 'bg-nirmal-maroon text-white border-nirmal-maroon'
                      : 'bg-transparent text-nirmal-dark border-nirmal-dark/20 hover:border-nirmal-maroon'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-8">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 bg-white border border-nirmal-dark/10 rounded-2xl p-6">
          <FilterPanel />
        </div>
      </aside>

      {/* Main column */}
      <div>
        {/* Search */}
        <div className="relative mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nirmal-dark/40">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a spice, e.g. Garam Masala..."
            className="w-full border border-nirmal-dark/15 rounded-xl pl-10 pr-4 py-3 bg-white text-sm focus:outline-none focus:border-nirmal-maroon shadow-sm"
          />
        </div>

        {/* Top bar: count + desktop sort */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-nirmal-dark/60">
            <span className="font-bold text-nirmal-dark">{filteredProducts.length}</span> Products
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="hidden sm:block border border-nirmal-dark/15 rounded-xl px-4 py-2.5 bg-white text-sm text-nirmal-dark focus:outline-none focus:border-nirmal-maroon shadow-sm cursor-pointer"
            aria-label="Sort products"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {selectedCategories.map((c) => (
              <button key={c} onClick={() => toggle(selectedCategories, c, setSelectedCategories)} className="flex items-center gap-1.5 bg-nirmal-maroon/10 text-nirmal-maroon text-xs font-medium pl-3 pr-2 py-1.5 rounded-full">
                {c} <span className="text-sm leading-none">&times;</span>
              </button>
            ))}
            {selectedPriceBuckets.map((p) => (
              <button key={p} onClick={() => toggle(selectedPriceBuckets, p, setSelectedPriceBuckets)} className="flex items-center gap-1.5 bg-nirmal-maroon/10 text-nirmal-maroon text-xs font-medium pl-3 pr-2 py-1.5 rounded-full">
                {p} <span className="text-sm leading-none">&times;</span>
              </button>
            ))}
            {selectedWeights.map((w) => (
              <button key={w} onClick={() => toggle(selectedWeights, w, setSelectedWeights)} className="flex items-center gap-1.5 bg-nirmal-maroon/10 text-nirmal-maroon text-xs font-medium pl-3 pr-2 py-1.5 rounded-full">
                {w} <span className="text-sm leading-none">&times;</span>
              </button>
            ))}
            <button onClick={clearAll} className="text-xs font-semibold text-nirmal-cta hover:underline px-2 py-1.5">
              Clear All
            </button>
          </div>
        )}

        {/* Product Grid — Myntra-style density, all cards equal height */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-24 lg:pb-0 items-stretch">
          {filteredProducts.map((product: any, index: number) => (
            <div key={`${product.id}-${index}`} className="h-full animate-fade-up" style={{ animationDelay: `${(index % 8) * 50}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-nirmal-maroon/10 flex items-center justify-center mx-auto mb-4">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-nirmal-maroon" strokeWidth="1.7">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <p className="text-nirmal-dark font-serif text-lg mb-1">No products found</p>
            <p className="text-nirmal-dark/60 text-sm mb-4">Try removing a filter or searching a different term.</p>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-sm font-semibold text-nirmal-cta hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile sticky Filter/Sort bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-nirmal-dark/10 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] grid grid-cols-2 divide-x divide-nirmal-dark/10">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center justify-center gap-2 py-4 text-sm font-semibold text-nirmal-dark"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
          Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
        <button
          onClick={() => setMobileSortOpen(true)}
          className="flex items-center justify-center gap-2 py-4 text-sm font-semibold text-nirmal-dark"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7h18M6 12h12M10 17h4" /></svg>
          Sort: {sortLabel[sort]}
        </button>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${mobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
        <div className={`absolute bottom-0 inset-x-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto transition-transform duration-300 ${mobileFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="p-6">
            <div className="flex justify-end mb-2">
              <button onClick={() => setMobileFilterOpen(false)} className="text-nirmal-dark/50 text-xl leading-none p-1" aria-label="Close filters">&times;</button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full mt-6 bg-nirmal-cta text-nirmal-cream font-semibold py-3.5 rounded-xl"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sort Bottom Sheet */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${mobileSortOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSortOpen(false)} />
        <div className={`absolute bottom-0 inset-x-0 bg-white rounded-t-2xl transition-transform duration-300 ${mobileSortOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="p-6">
            <h3 className="font-serif font-bold text-lg text-nirmal-dark mb-4">Sort By</h3>
            {(Object.keys(sortLabel) as SortOption[]).map((key) => (
              <button
                key={key}
                onClick={() => { setSort(key); setMobileSortOpen(false); }}
                className={`w-full text-left py-3.5 border-b border-nirmal-dark/5 last:border-0 text-sm ${sort === key ? 'text-nirmal-maroon font-bold' : 'text-nirmal-dark'}`}
              >
                {sortLabel[key]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}