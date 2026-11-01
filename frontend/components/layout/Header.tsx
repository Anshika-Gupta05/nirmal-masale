'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [bump, setBump] = useState(false);
  const lastY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const [menuTop, setMenuTop] = useState(112);
  const prevCount = useRef(cartCount);
  const pathname = usePathname();

  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  // Start the mobile menu exactly where the header ends (its height changes with the
  // announcement bar, scroll position and screen size, so never hard-code it)
  useEffect(() => {
    if (isMenuOpen && headerRef.current) {
      setMenuTop(Math.round(headerRef.current.getBoundingClientRect().bottom));
    }
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Compact + glassy once scrolled; slide away on scroll-down, return on scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 240 && y > lastY.current + 4 && !isMenuOpen);
      if (y < lastY.current - 4 || y <= 240) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMenuOpen]);

  // Cart badge bounce whenever an item is added
  useEffect(() => {
    if (cartCount > prevCount.current) {
      setBump(true);
      const t = window.setTimeout(() => setBump(false), 500);
      prevCount.current = cartCount;
      return () => window.clearTimeout(t);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-surface-2 text-gold-soft text-[clamp(9px,2.5vw,11px)] tracking-widest sm:tracking-[0.18em] uppercase border-b border-gold/30">
        <div className="container mx-auto px-6 py-2 text-center font-medium">
          Free delivery above ₹300 <span className="text-gold mx-2">◆</span> Pure &amp; stone-ground since 2001
        </div>
      </div>

      <header
        ref={headerRef}
        className={`sticky top-0 z-40 border-b transition-all duration-500 ease-out ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        } ${
          scrolled
            ? 'bg-ink/80 backdrop-blur-xl border-gold/30 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)]'
            : 'bg-ink/95 backdrop-blur border-gold/15'
        }`}
      >
        <nav className={`container mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-500 ease-out ${scrolled ? 'h-16' : 'h-20'}`}>
          <Link
            href="/"
            className={`relative shrink-0 transition-all duration-500 ease-out hover:scale-105 ${
              scrolled ? 'w-20 h-10' : 'w-24 h-12'
            }`}
            aria-label="Nirmal Gold Masale home"
          >
            <Image src="/nirmal_gold_masale_logo.png" alt="Nirmal Gold Masale" fill className="object-contain" priority />
          </Link>

          <div className="hidden md:flex items-center gap-[clamp(1.1rem,2.8vw,2.5rem)]">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  data-active={active}
                  className={`link-underline text-[clamp(10px,1.05vw,12px)] uppercase tracking-[0.16em] lg:tracking-[0.22em] whitespace-nowrap transition-colors py-2 ${active ? 'text-gold-soft' : 'text-ivory/75 hover:text-gold-soft'}`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openDrawer}
              aria-label={`Open cart, ${cartCount} items`}
              className="relative p-2 text-ivory hover:text-gold-soft hover:scale-110 active:scale-95 transition-all duration-300"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              {cartCount > 0 && (
                <span className={`absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 rounded-full bg-gold-soft text-ink text-[10px] font-bold flex items-center justify-center ${bump ? 'animate-bump' : ''}`}>
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

      </header>

    {isMenuOpen && (
      <div className="md:hidden fixed inset-x-0 bottom-0 z-39 overflow-y-auto bg-ink/95 backdrop-blur-xl px-6 sm:px-8 pt-8 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] flex flex-col gap-5 border-t border-gold/25 animate-fade-in" style={{ top: menuTop }}>
        {NAV_LINKS.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className="menu-link-in font-serif text-[clamp(1.35rem,5.4vw,2rem)] leading-tight text-ivory hover:text-gold-soft hover:translate-x-2 transition-all"
            style={{ animationDelay: `${80 + i * 70}ms` }}
          >
            {l.label}
          </Link>
        ))}
        <div className="hairline mt-4" />
        <p className="eyebrow menu-link-in" style={{ animationDelay: '420ms' }}>Dehradun ◆ Since 2001</p>
      </div>
    )}
    </>
  );
}