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

  useEffect(() => { setIsMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      {/* Announcement Bar with refined surface color and gold accent */}
      <div className="bg-surface-2 text-gold-soft text-[11px] tracking-[0.18em] uppercase border-b border-gold/30">
        <div className="container mx-auto px-6 py-2 text-center font-medium">
          Free delivery above ₹300 <span className="text-gold mx-2">◆</span> Pure &amp; stone-ground since 2001
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-ink/85 backdrop-blur border-b border-gold/25">
        <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="relative w-28 h-16 shrink-0" aria-label="Nirmal Gold Masale home">
            <Image src="/nirmal_gold_masale_logo.png" alt="Nirmal Gold Masale" fill className="object-contain" priority />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative text-[12px] uppercase tracking-[0.22em] transition-colors py-2 ${active ? 'text-gold-soft' : 'text-ivory/75 hover:text-gold-soft'}`}
                >
                  {l.label}
                  {active && <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gold" />}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openDrawer}
              aria-label={`Open cart, ${cartCount} items`}
              className="relative p-2 text-ivory hover:text-gold-soft transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gold-soft text-ink text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className="md:hidden p-2 text-ivory"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                {isMenuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[calc(2rem+5rem)] bottom-0 bg-ink z-50 px-8 py-10 flex flex-col gap-6 border-t border-gold/25">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="font-serif text-4xl text-ivory hover:text-gold-soft">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}