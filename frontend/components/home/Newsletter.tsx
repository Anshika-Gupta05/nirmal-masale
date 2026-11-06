'use client';

import { useState } from 'react';
import { apiUrl } from '@/lib/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mailSent, setMailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim();
    if (!clean || loading) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(apiUrl('/api/newsletter/subscribe'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.detail === 'string' ? data.detail : 'Something went wrong. Please try again.');
        return;
      }
      setMailSent(Boolean(data.email_queued));
      setSubmitted(true);
    } catch {
      setError("Couldn't reach the server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-20 bg-ink bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(94,26,23,0.85),transparent_70%)] border-y border-gold/20 text-ivory relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3 text-ivory">
            Stay Connected With Us
          </h2>
          <p className="text-ivory/80 mb-8">
            Get updates on new spice blends, seasonal combos and kitchen tips — straight from Dehradun.
          </p>

          {submitted ? (
            <div className="bg-surface-2 border border-gold/40 rounded-xl p-5 text-gold-soft font-medium">
              {mailSent
                ? "Thank you! A welcome email is on its way. Please check your inbox (and spam folder)."
                : "Thank you! We'll keep you posted on what's new."}
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
                className="flex-1 px-5 py-3.5 rounded-xl text-ivory bg-surface-2 border border-gold/30 placeholder:text-ivory/40 focus:outline-none focus:border-gold-soft focus:ring-1 focus:ring-gold-soft"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gold-soft text-ink font-semibold px-6 py-3.5 rounded-xl hover:bg-nirmal-gold transition-colors shadow-md whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          )}
          {error && !submitted && (
            <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>
          )}

          <div className="flex items-center justify-center gap-4 mt-8">
            <a
              href="https://www.facebook.com/NirmalMasale12"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-surface-2 border border-gold/30 text-ivory hover:bg-gold-soft hover:text-ink flex items-center justify-center transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h2.7l.4-3H13V9c0-.9.2-1.5 1.6-1.5H16V5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 3.9V11H7v3h2.8v8h3.2Z"/></svg>
            </a>
            <a
              href="https://www.instagram.com/nirmalmasale"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-surface-2 border border-gold/30 text-ivory hover:bg-gold-soft hover:text-ink flex items-center justify-center transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}