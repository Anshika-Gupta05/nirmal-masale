'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartProvider';

export default function Header() {
  const { openDrawer, cartCount } = useCart();

  return (
    <>
      {/* Trust strip */}
      <div className="bg-nirmal-maroon text-nirmal-cream text-xs">
        <div className="container mx-auto px-6 py-2 flex items-center justify-center gap-6 flex-wrap text-center">
          <span>100% Pure &amp; Stone Ground</span>
          <span className="opacity-40">|</span>
          <span>Trusted Since 2001</span>
          <span className="opacity-40">|</span>
          <span>Hygienically Packed</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-nirmal-cream border-b border-nirmal-maroon/20">
      <nav className="container mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo Section with proper rectangular dimensions */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-16 h-12 overflow-hidden flex items-center justify-center">
            <Image
              src="/nirmal_gold_masale_logo.png"
              alt="Nirmal Masale Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-nirmal-dark hover:text-nirmal-maroon transition-colors">Home</Link>
          <Link href="/shop" className="text-nirmal-dark hover:text-nirmal-maroon transition-colors">Shop</Link>
          <Link href="/heritage" className="text-nirmal-dark hover:text-nirmal-maroon transition-colors">Heritage</Link>
          <Link href="/track-order" className="text-nirmal-dark hover:text-nirmal-maroon transition-colors">Track Order</Link>
        </div>

        {/* Icons/CTA */}
        <div className="flex items-center gap-4">
          <button 
            onClick={openDrawer} 
            className="relative p-2 flex items-center gap-2 text-nirmal-dark hover:text-nirmal-maroon transition-colors font-medium"
            aria-label="Open cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {/* Dynamic Cart Badge */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-nirmal-cta text-nirmal-cream text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
          
          <button className="md:hidden p-2 text-nirmal-dark hover:text-nirmal-maroon">
            Menu
          </button>
        </div>
      </nav>
      </header>
    </>
  );
}