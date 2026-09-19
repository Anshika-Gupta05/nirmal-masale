import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-nirmal-cream text-nirmal-dark mt-auto border-t-4 border-nirmal-maroon">
      {/* Trust strip */}
      <div className="bg-white border-b border-nirmal-maroon/10">
        <div className="container mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { title: 'Free Delivery', sub: 'On orders above ₹300' },
            { title: 'Secure Checkout', sub: 'Your data stays protected' },
            { title: '100% Pure', sub: 'No fillers or additives' },
            { title: 'Trusted Since 2001', sub: 'Loved by lakhs of homes' },
          ].map((item) => (
            <div key={item.title}>
              <p className="text-sm font-serif font-bold text-nirmal-maroon">{item.title}</p>
              <p className="text-xs text-nirmal-dark/50 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="flex flex-col items-start gap-3">
          <div className="relative w-40 h-24">
            <Image
              src="/nirmal_gold_masale_logo.png"
              alt="Nirmal Masale Logo"
              fill
              className="object-contain object-left"
            />
          </div>
          <p className="text-sm text-nirmal-dark/60">
            Pure Spices, Royal Taste. Established 2001 in Dehradun, Uttarakhand.
          </p>
          <div className="flex items-center gap-3 mt-1">
            <a href="https://www.facebook.com/NirmalMasale12" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-nirmal-dark/60 hover:text-nirmal-maroon transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h2.7l.4-3H13V9c0-.9.2-1.5 1.6-1.5H16V5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 3.9V11H7v3h2.8v8h3.2Z"/></svg>
            </a>
            <a href="https://www.instagram.com/nirmalmasale" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-nirmal-dark/60 hover:text-nirmal-maroon transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
            </a>
            <a href="https://wa.me/918859274835" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-nirmal-dark/60 hover:text-nirmal-maroon transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.42a9.87 9.87 0 0 0 4.62 1.18h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Z"/></svg>
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
            <li><Link href="/checkout" className="hover:text-nirmal-maroon transition-colors">Cart &amp; Checkout</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-serif font-bold text-nirmal-maroon mb-4">Categories</h3>
          <ul className="space-y-2 text-sm text-nirmal-dark/70">
            <li><Link href="/shop?category=Blended%20Spices" className="hover:text-nirmal-maroon transition-colors">Blended Spices</Link></li>
            <li><Link href="/shop?category=Ground%20Spices" className="hover:text-nirmal-maroon transition-colors">Ground Spices</Link></li>
            <li><Link href="/shop?category=Whole%20Spices%20%26%20Seeds" className="hover:text-nirmal-maroon transition-colors">Whole Spices &amp; Seeds</Link></li>
            <li><Link href="/shop?category=Specialty%20Essentials" className="hover:text-nirmal-maroon transition-colors">Specialty Essentials</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-serif font-bold text-nirmal-maroon mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm text-nirmal-dark/70">
            <li>
              <a href="mailto:support@nirmalmasale.in" className="hover:text-nirmal-maroon transition-colors">
                support@nirmalmasale.in
              </a>
            </li>
            <li>
              <a href="https://wa.me/918859274835" target="_blank" rel="noopener noreferrer" className="hover:text-nirmal-maroon transition-colors">
                +91 8859274835
              </a>
            </li>
            <li>Dehradun, Uttarakhand, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-nirmal-dark/10">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-nirmal-dark/40 text-center">
          <span>&copy; {new Date().getFullYear()} Nirmal Masale. All rights reserved.</span>
          <span>A brand of Nirmal J.K Industries</span>
        </div>
      </div>
    </footer>
  );
}