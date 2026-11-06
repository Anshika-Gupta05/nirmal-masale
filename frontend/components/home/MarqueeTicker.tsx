const MESSAGES = [
  'Pure Spices, Royal Taste',
  'Hand-Selected in Dehradun',
  'Hygienically Packed',
  'Sealed Fresh',
  'Loved By Lakhs of Homes',
];

export default function MarqueeTicker() {
  const loop = [...MESSAGES, ...MESSAGES];

  return (
    <div
      className="group bg-ink border-y border-gold/25 overflow-hidden py-3.5"
      aria-hidden="true"
      style={{ maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)' }}
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {loop.map((msg, i) => (
          <span key={i} className="flex items-center px-8 font-serif text-lg italic text-gold-soft/90 whitespace-nowrap">
            {msg}
            <span className="ml-16 text-gold/60 not-italic text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}