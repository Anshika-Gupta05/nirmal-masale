'use client';

import { useState } from 'react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/orders/${orderId.trim()}`);
      const data = await res.json();

      if (data.status === 'success') {
        setOrderData(data.data);
      } else {
        setError('Order not found. Please check your tracking number and try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-nirmal-maroon/10 shadow-sm text-center">
        <div className="w-14 h-14 rounded-full bg-nirmal-maroon/10 flex items-center justify-center mx-auto mb-5">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-nirmal-maroon" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8 12 3 3 8l9 5 9-5Z" />
            <path d="M3 8v8l9 5 9-5V8" />
            <path d="M12 13v8" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-bold text-nirmal-dark mb-2">Track Your Order</h1>
        <p className="text-sm text-nirmal-dark/70 mb-8">Enter your Order ID below to check the real-time shipping status of your spices.</p>
        
        <form className="space-y-4" onSubmit={handleTrack}>
          <div className="text-left">
            <label className="text-xs font-semibold text-nirmal-dark/70 uppercase block mb-2">Order ID</label>
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. NRM-10293" 
              className="w-full border border-nirmal-dark/20 rounded-xl px-4 py-3 bg-[#f9f0e6]/30 focus:outline-none focus:border-nirmal-maroon text-nirmal-dark" 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-nirmal-gold text-nirmal-dark font-semibold py-3.5 rounded-xl hover:bg-nirmal-gold/90 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Package'}
          </button>
        </form>

        {error && (
          <p className="mt-6 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
            {error}
          </p>
        )}

        {orderData && (
          <div className="mt-8 text-left bg-[#f9f0e6]/40 p-5 rounded-xl border border-nirmal-maroon/10">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-nirmal-dark/10">
              <span className="text-xs font-semibold uppercase text-nirmal-dark/60">Status</span>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">
                {orderData.status}
              </span>
            </div>
            <p className="text-sm text-nirmal-dark mb-1">
              <strong>Customer:</strong> {orderData.customer_first_name} {orderData.customer_last_name}
            </p>
            <p className="text-sm text-nirmal-dark mb-1">
              <strong>Delivery Address:</strong> {orderData.address}
            </p>
            <p className="text-sm text-nirmal-dark mb-3">
              <strong>Total Amount:</strong> ₹{orderData.total_amount}
            </p>
            
            <div className="text-xs font-semibold text-nirmal-dark/70 uppercase mb-2">Ordered Items:</div>
            <ul className="space-y-1 text-xs text-nirmal-dark/80">
              {orderData.items?.map((item: any, idx: number) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.product_name} ({item.weight}) x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}