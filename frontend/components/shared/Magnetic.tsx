'use client';

import { useRef } from 'react';

/** Makes a CTA gently pull toward the cursor. Wrap a Link/button with it. */
export default function Magnetic({
  children,
  strength = 0.25,
  className = '',
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const ok = () =>
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !ok()) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  );
}