'use client';

import { useRef } from 'react';

/**
 * Wraps content in a subtle 3D tilt + cursor-following gold spotlight.
 * Disabled automatically on touch devices and for reduced-motion users.
 */
export default function TiltCard({
  children,
  className = '',
  max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const canAnimate = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !canAnimate()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateZ(0)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`spotlight transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}