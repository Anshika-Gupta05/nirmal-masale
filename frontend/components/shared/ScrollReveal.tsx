'use client';

import { useEffect, useRef, useState } from 'react';

type Variant = 'up' | 'left' | 'right' | 'scale' | 'fade';

export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
  variant = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: Variant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-variant={variant}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}