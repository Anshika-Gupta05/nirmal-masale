'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiUrl } from '@/lib/api';
import WordReveal from '@/components/shared/WordReveal';

const STATUS_STEPS = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
const STEP_DELAY = 420; // ms between each timeline step lighting up

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorKey, setErrorKey] = useState(0); // re-triggers the shake on every new error
  const [progressOn, setProgressOn] = useState(false);

  const fail = useCallback((msg: string) => {
    setError(msg);
    setErrorKey((k) => k + 1);
  }, []);

  const trackOrder = useCallback(
    async (rawId: string) => {
      const id = rawId.trim();
      if (!id) return;

      setOrderId(id.toUpperCase()); // tracking numbers are upper-case, e.g. NRM-A1B2C3
      setLoading(true);
      setError('');
      setOrderData(null);

      try {
        const res = await fetch(apiUrl(`/api/orders/${encodeURIComponent(id)}`));
        const data = await res.json();

        if (data.status === 'success') {
          setOrderData(data.data);
        } else {
          fail('Order not found. Please check your tracking number and try again.');
        }
      } catch {
        fail('Failed to connect to the server. Please try again later.');
      } finally {
        setLoading(false);
      }
    },
    [fail],
  );

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    void trackOrder(orderId);
  };

  // Arriving from checkout (or the email) via /track-order?order=NRM-XXXXXX:
  // fill the box with that number and look it up straight away.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('order')?.trim();
    if (!id) return;
    // Deferred a tick; the cleanup also guarantees a single lookup under React Strict Mode.
    const timer = window.setTimeout(() => void trackOrder(id), 0);
    return () => window.clearTimeout(timer);
  }, [trackOrder]);

  // Start the timeline fill just after the result card has appeared
  useEffect(() => {
    if (!orderData) {
      setProgressOn(false);
      return;
    }
    const t = window.setTimeout(() => setProgressOn(true), 350);
    return () => window.clearTimeout(t);
  }, [orderData]);

  const currentStepIndex = orderData
    ? Math.max(0, STATUS_STEPS.findIndex((s) => s.toLowerCase() === String(orderData.status).toLowerCase()))
    : -1;
  const delivered = currentStepIndex === STATUS_STEPS.length - 1;

  return (
    <div className="relative overflow-hidden">
      {/* ambient glows */}
      <div className="absolute -top-24 left-[6%] w-104 h-104 rounded-full bg-gold/10 blur-3xl animate-drift pointer-events-none" />
      <div className="absolute bottom-0 -right-24 w-104 h-104 rounded-full bg-oxblood/40 blur-3xl animate-drift pointer-events-none" style={{ animationDelay: '-7s' }} />

      <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col items-center justify-center min-h-[70dvh] relative z-10">
        {/* Heading */}
        <div className="text-center max-w-xl mb-10">
          <p className="eyebrow mb-4 animate-fade-in">Order Tracking</p>
          <h1 className="font-serif font-medium text-4xl md:text-6xl text-ivory leading-[1.08]">
            <WordReveal text="Track Your Order" startDelay={80} highlight={['Order']} />
          </h1>
          <p className="mt-5 text-ivory-muted animate-fade-up" style={{ animationDelay: '450ms' }}>
            Enter your Order ID to see where your spices are right now.
          </p>
        </div>

        <div
          className="spotlight max-w-lg w-full bg-surface p-8 md:p-10 rounded-2xl border border-gold/25 hover:border-gold/45 transition-colors duration-500 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] text-center animate-fade-up"
          style={{ animationDelay: '600ms' }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
            e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
          }}
        >
          {/* Truck on a moving road */}
          <div className="mx-auto mb-7 w-40">
            <div className="animate-truck text-gold-soft flex justify-center">
              <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 7h11v9H3z" />
                <path d="M14 10h4l3 3v3h-7z" />
                <circle cx="7" cy="17.5" r="1.8" />
                <circle cx="17" cy="17.5" r="1.8" />
              </svg>
            </div>
            <div className="road h-0.5 mt-0.5" />
          </div>

          <form className="space-y-5" onSubmit={handleTrack}>
            <div className="text-left">
              <label htmlFor="order-id" className="text-[11px] font-semibold text-gold-soft uppercase tracking-[0.2em] block mb-2">
                Order ID
              </label>
              <input
                id="order-id"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. NRM-A1B2C3"
                className="input-glow w-full border border-gold/30 rounded-xl px-4 py-3.5 bg-ink/60 text-ivory placeholder:text-ivory-muted/50 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-sheen w-full flex items-center justify-center gap-2.5 bg-gold-soft text-ink font-semibold py-3.5 rounded-xl hover:bg-ivory active:scale-[0.98] transition-all shadow-md disabled:opacity-70"
            >
              {loading && (
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {loading ? 'Searching…' : 'Track Package'}
            </button>
          </form>

          {error && (
            <p
              key={errorKey}
              role="alert"
              className="animate-shake mt-6 text-sm text-red-300 bg-red-500/10 p-3 rounded-xl border border-red-400/30"
            >
              {error}
            </p>
          )}

          {orderData && (
            <div className="mt-8 text-left animate-fade-up">
              {/* Status Timeline */}
              {currentStepIndex >= 0 && (
                <div className="mb-7 px-1">
                  <div className="flex items-start justify-between">
                    {STATUS_STEPS.map((step, i) => {
                      const reached = progressOn && i <= currentStepIndex;
                      const isCurrent = progressOn && i === currentStepIndex;
                      return (
                        <div key={step} className="flex-1 flex flex-col items-center relative">
                          {i > 0 && (
                            <div className="absolute top-3 right-1/2 w-full h-0.5 bg-gold/15 overflow-hidden">
                              <div
                                className="h-full w-full bg-linear-to-r from-gold to-gold-soft origin-left transition-transform ease-out"
                                style={{
                                  transform: progressOn && i <= currentStepIndex ? 'scaleX(1)' : 'scaleX(0)',
                                  transitionDuration: `${STEP_DELAY}ms`,
                                  transitionDelay: `${(i - 1) * STEP_DELAY + 150}ms`,
                                }}
                              />
                            </div>
                          )}
                          <div className="relative z-10">
                            {isCurrent && !delivered && (
                              <span
                                className="absolute inset-0 rounded-full bg-gold-soft/50 animate-ping"
                                style={{ animationDelay: `${i * STEP_DELAY}ms` }}
                                aria-hidden="true"
                              />
                            )}
                            <div
                              className={`relative w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-500 ${
                                reached
                                  ? 'bg-gold-soft border-gold-soft text-ink shadow-[0_0_14px_rgba(217,184,114,0.55)]'
                                  : 'bg-ink border-gold/30 text-ivory/40'
                              } ${isCurrent ? 'scale-125' : ''}`}
                              style={{ transitionDelay: reached ? `${i * STEP_DELAY}ms` : '0ms' }}
                            >
                              {reached ? '✓' : i + 1}
                            </div>
                          </div>
                          <span
                            className={`text-[11px] mt-2 text-center leading-tight transition-colors duration-500 ${
                              reached ? 'text-gold-soft' : 'text-ivory-muted'
                            }`}
                            style={{ transitionDelay: reached ? `${i * STEP_DELAY}ms` : '0ms' }}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-ink/50 p-5 rounded-xl border border-gold/20">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-gold/15">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ivory-muted">Status</span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold border animate-pop ${
                      delivered
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                        : 'bg-gold/10 text-gold-soft border-gold/40'
                    }`}
                  >
                    {orderData.status}
                  </span>
                </div>
                <p className="text-sm text-ivory mb-1">
                  <strong className="text-gold-soft font-semibold">Customer:</strong> {orderData.customer_first_name} {orderData.customer_last_name}
                </p>
                <p className="text-sm text-ivory mb-1">
                  <strong className="text-gold-soft font-semibold">Delivery Address:</strong> {orderData.address}
                </p>
                <p className="text-sm text-ivory mb-4">
                  <strong className="text-gold-soft font-semibold">Total Amount:</strong> ₹{orderData.total_amount}
                </p>

                <div className="text-[11px] font-semibold text-gold-soft uppercase tracking-[0.2em] mb-2">Ordered Items</div>
                <ul className="space-y-1.5 text-xs text-ivory/85">
                  {orderData.items?.map((item: any, idx: number) => (
                    <li
                      key={idx}
                      className="stagger-item flex justify-between gap-3"
                      style={{ animationDelay: `${300 + idx * 90}ms` }}
                    >
                      <span>{item.product_name} ({item.weight}) x {item.quantity}</span>
                      <span className="text-gold-soft whitespace-nowrap">₹{item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}