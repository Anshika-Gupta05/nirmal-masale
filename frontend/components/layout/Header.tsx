'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartProvider';

export default function Header() {
  const { openDrawer, cartCount } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-nirmal-cream border-b border-nirmal-maroon/20">
      <nav className="container mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo Section with proper rectangular dimensions */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-14 h-10 overflow-hidden flex items-center justify-center">
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
            className="relative p-2 flex items-center gap-2 text-nirmal-dark hover:text-nirmal-gold transition-colors font-medium"
          >
            <span>Cart</span>
            {/* Dynamic Cart Badge */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-nirmal-maroon text-nirmal-cream text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
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
  );
}