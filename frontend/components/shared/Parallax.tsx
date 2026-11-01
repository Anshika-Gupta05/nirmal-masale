'use client';

import { useEffect, useRef } from 'react';

/** Moves its children vertically at a fraction of scroll speed. speed: -0.2 .. 0.2 works well. */
export default function Parallax({
  children,
  speed = 0.08,
  className = '',
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 767px)').matches
    ) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${(-center * speed).toFixed(1)}px, 0)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return <div ref={ref} className={`will-change-transform ${className}`}>{children}</div>;
}