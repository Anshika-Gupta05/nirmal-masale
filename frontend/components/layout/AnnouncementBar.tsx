'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Offers / practical info only. Brand claims ("pure", "since 2001"...) live in the marquee and trust strip.
const MESSAGES: { text: string; href?: string }[] = [
  { text: 'Free delivery on orders above ₹300', href: '/shop' },
  { text: 'Everyday range: big flavour at ₹10 a pack', href: '/shop?price=Under%20%E2%82%B950' },
  { text: 'Pay online (UPI / Card) or Cash on Delivery' },
];

const INTERVAL_MS = 4500;

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Rotate one message at a time; stop while the visitor hovers or focuses the bar.
  // (The global prefers-reduced-motion rule in globals.css removes the fade for those users.)
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div
      role="region"
      aria-label="Announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="bg-surface-2 text-gold-soft text-xs tracking-[0.12em] sm:tracking-[0.18em] uppercase border-b border-gold/30"
    >
      {/* All messages share one grid cell, so the bar keeps a steady height while they cross-fade. */}
      <div className="container mx-auto px-6 py-2.5 grid text-center font-medium">
        {MESSAGES.map((m, i) => {
          const active = i === index;
          const cls = `col-start-1 row-start-1 transition-opacity duration-700 ${
            active ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`;
          return m.href ? (
            <Link
              key={m.text}
              href={m.href}
              aria-hidden={!active}
              tabIndex={active ? 0 : -1}
              className={`${cls} hover:text-ivory transition-colors`}
            >
              {m.text}
            </Link>
          ) : (
            <span key={m.text} aria-hidden={!active} className={cls}>
              {m.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}