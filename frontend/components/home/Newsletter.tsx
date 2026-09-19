'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section className="py-16 md:py-20 bg-nirmal-maroon text-nirmal-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-spice-dots" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            Stay Connected With Us
          </h2>
          <p className="text-nirmal-cream/80 mb-8">
            Get updates on new spice blends, seasonal combos and kitchen tips — straight from Dehradun.
          </p>

          {submitted ? (
            <div className="bg-nirmal-cream/10 border border-nirmal-gold/40 rounded-xl p-5 text-nirmal-gold font-medium">
              Thank you! We&apos;ll keep you posted on what&apos;s new.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-5 py-3.5 rounded-xl text-nirmal-dark bg-nirmal-cream placeholder:text-nirmal-dark/40 focus:outline-none focus:ring-2 focus:ring-nirmal-gold"
              />
              <button
                type="submit"
                className="bg-nirmal-gold text-nirmal-dark font-semibold px-6 py-3.5 rounded-xl hover:bg-nirmal-gold/80 transition-colors shadow-md whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-4 mt-8">
            <a
              href="https://www.facebook.com/NirmalMasale12"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-nirmal-cream/10 hover:bg-nirmal-gold hover:text-nirmal-dark flex items-center justify-center transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h2.7l.4-3H13V9c0-.9.2-1.5 1.6-1.5H16V5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 3.9V11H7v3h2.8v8h3.2Z"/></svg>
            </a>
            <a
              href="https://www.instagram.com/nirmalmasale"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-nirmal-cream/10 hover:bg-nirmal-gold hover:text-nirmal-dark flex items-center justify-center transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}