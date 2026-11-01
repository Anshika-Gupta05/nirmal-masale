import React from 'react';

/** Splits text into words that rise out of a mask. Server-safe (pure CSS animation). */
export default function WordReveal({
  text,
  startDelay = 0,
  step = 70,
  highlight = [],
}: {
  text: string;
  startDelay?: number;
  step?: number;
  /** words (exact match, without punctuation) rendered with the gold shimmer */
  highlight?: string[];
}) {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => {
        const clean = w.replace(/[.,]/g, '');
        const hl = highlight.includes(clean);
        return (
          <React.Fragment key={`${w}-${i}`}>
            <span className="word-mask">
              <span
                className={hl ? 'text-gold-shimmer' : undefined}
                style={{ animationDelay: `${startDelay + i * step}ms` }}
              >
                {w}
              </span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </>
  );
}