import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-nirmal-cream text-nirmal-dark mt-auto border-t-4 border-nirmal-maroon">
      <div className="container mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="flex flex-col items-start gap-3">
          <div className="relative w-28 h-12">
            <Image
              src="/nirmal_gold_masale_logo.png"
              alt="Nirmal Masale Logo"
              fill
              className="object-contain object-left"
            />
          </div>
          <p className="text-sm text-nirmal-dark/60">
            Pure Spices, Royal Taste. Established 2001 in Dehradun.
          </p>
          <div className="flex items-center gap-3 mt-1">
            <a href="https://www.facebook.com/NirmalMasale12" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-nirmal-dark/60 hover:text-nirmal-maroon transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h2.7l.4-3H13V9c0-.9.2-1.5 1.6-1.5H16V5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 3.9V11H7v3h2.8v8h3.2Z"/></svg>
            </a>
            <a href="https://www.instagram.com/nirmalmasale" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-nirmal-dark/60 hover:text-nirmal-maroon transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-serif font-bold text-nirmal-maroon mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-nirmal-dark/70">
            <li><Link href="/shop" className="hover:text-nirmal-maroon transition-colors">Shop</Link></li>
            <li><Link href="/heritage" className="hover:text-nirmal-maroon transition-colors">Our Heritage</Link></li>
            <li><Link href="/track-order" className="hover:text-nirmal-maroon transition-colors">Track Order</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-serif font-bold text-nirmal-maroon mb-4">Categories</h3>
          <ul className="space-y-2 text-sm text-nirmal-dark/70">
            <li><Link href="/shop" className="hover:text-nirmal-maroon transition-colors">Blended Spices</Link></li>
            <li><Link href="/shop" className="hover:text-nirmal-maroon transition-colors">Ground Spices</Link></li>
            <li><Link href="/shop" className="hover:text-nirmal-maroon transition-colors">Whole Spices &amp; Seeds</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-serif font-bold text-nirmal-maroon mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm text-nirmal-dark/70">
            <li>support@nirmalmasale.in</li>
            <li>Dehradun, Uttarakhand</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-nirmal-dark/10">
        <div className="container mx-auto px-6 py-4 text-xs text-nirmal-dark/40 text-center">
          &copy; {new Date().getFullYear()} Nirmal Masale. All rights reserved.
        </div>
      </div>
    </footer>
  );
}