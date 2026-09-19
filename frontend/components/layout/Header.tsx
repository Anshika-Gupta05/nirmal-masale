'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/heritage', label: 'Heritage' },
  { href: '/track-order', label: 'Track Order' },
];

export default function Header() {
  const { openDrawer, cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on route change and lock scroll while it's open
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Trust strip */}
      <div className="bg-nirmal-maroon text-nirmal-cream text-xs">
        <div className="container mx-auto px-6 py-2 flex items-center justify-center gap-x-6 gap-y-1 flex-wrap text-center">
          <span>100% Pure &amp; Stone Ground</span>
          <span className="opacity-40 hidden sm:inline">|</span>
          <span>Trusted Since 2001</span>
          <span className="opacity-40 hidden sm:inline">|</span>
          <span>Free Delivery Above ₹300</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-nirmal-cream/95 backdrop-blur supports-[backdrop-filter]:bg-nirmal-cream/90 border-b border-nirmal-maroon/20">
        <nav className="container mx-auto px-6 py-2 flex items-center justify-between">
          {/* Logo Section with proper rectangular dimensions */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-32 h-20 sm:w-36 sm:h-24 overflow-hidden flex items-center justify-center">
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
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive ? 'text-nirmal-maroon' : 'text-nirmal-dark hover:text-nirmal-maroon'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-nirmal-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Icons/CTA */}
          <div className="flex items-center gap-1 sm:gap-3">
            <a
              href="https://wa.me/918859274835"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Call us"
              className="hidden lg:flex items-center gap-2 text-sm text-nirmal-dark hover:text-nirmal-maroon transition-colors mr-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
              +91 8859274835
            </a>

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
                <span key={cartCount} className="absolute -top-1 -right-1 bg-nirmal-cta text-nirmal-cream text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm animate-pop">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden p-2 text-nirmal-dark hover:text-nirmal-maroon relative w-9 h-9 flex items-center justify-center"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              <span
                className={`absolute h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                }`}
              />
            </button>
          </div>
        </nav>

        {/* Mobile Menu Panel */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-nirmal-maroon/10 ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1 bg-nirmal-cream">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 text-base font-medium border-b border-nirmal-dark/5 last:border-0 ${
                  pathname === link.href ? 'text-nirmal-maroon' : 'text-nirmal-dark'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/918859274835"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 bg-nirmal-maroon text-nirmal-cream font-semibold py-3 rounded-xl"
            >
              Chat With Us
            </a>
          </div>
        </div>
      </header>
    </>
  );
}