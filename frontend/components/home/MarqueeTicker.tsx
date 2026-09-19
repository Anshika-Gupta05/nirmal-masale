const MESSAGES = [
  'Since 2001',
  '100% Pure & Stone Ground',
  'No Artificial Additives',
  'Free Delivery Above ₹300',
  'Hygienically Packed',
  'Loved By Lakhs of Homes',
];

export default function MarqueeTicker() {
  const loop = [...MESSAGES, ...MESSAGES];

  return (
    <div className="bg-nirmal-gold text-nirmal-maroon-dark overflow-hidden py-2.5 border-y border-nirmal-maroon-dark/10">
      <div className="flex w-max animate-marquee">
        {loop.map((msg, i) => (
          <span key={i} className="flex items-center px-6 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
            {msg}
            <span className="ml-6 opacity-50">&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  );
}