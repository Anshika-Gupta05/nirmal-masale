import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-6 py-28 text-center max-w-lg flex-grow flex flex-col items-center justify-center">
      <span className="font-serif text-7xl font-bold text-nirmal-maroon/20 mb-2">404</span>
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-nirmal-dark mb-3">
        This page has wandered off the spice rack
      </h1>
      <p className="text-nirmal-dark/60 text-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back to something delicious.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="bg-nirmal-maroon text-nirmal-cream font-semibold px-6 py-3 rounded-xl hover:bg-nirmal-maroon-dark transition-colors">
          Back to Home
        </Link>
        <Link href="/shop" className="border border-nirmal-maroon/30 text-nirmal-maroon font-semibold px-6 py-3 rounded-xl hover:bg-nirmal-maroon/5 transition-colors">
          Browse Shop
        </Link>
      </div>
    </div>
  );
}