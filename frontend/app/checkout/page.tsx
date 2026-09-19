'use client';

import { useState } from 'react';
import { useCart } from '@/components/layout/CartProvider';
import Link from 'next/link';
import Image from 'next/image';
import { apiUrl } from '@/lib/api';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'cod' | 'online';
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  paymentMethod: 'cod',
};

export default function CheckoutPage() {
  const { items, cartCount, subtotal, clearCart } = useCart();
  const shipping = subtotal > 300 ? 0 : 50;
  const total = subtotal + shipping;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) next.firstName = 'Required';
    if (!form.lastName.trim()) next.lastName = 'Required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) next.phone = 'Enter a valid 10-digit number';
    if (!form.address.trim()) next.address = 'Required';
    if (!form.city.trim()) next.city = 'Required';
    if (!form.state.trim()) next.state = 'Required';
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = 'Enter a valid 6-digit pincode';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const fullAddress = `${form.address}, ${form.city}, ${form.state} - ${form.pincode} | Phone: ${form.phone} | Email: ${form.email} | Payment: ${form.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}`;

      const res = await fetch(apiUrl('/api/checkout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          address: fullAddress,
          total_amount: total,
          items: items.map((item) => ({
            product_name: item.name,
            weight: item.selectedSize,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        setOrderNumber(data.order_number);
        clearCart();
      } else {
        setSubmitError(data.message || 'Something went wrong while placing your order. Please try again.');
      }
    } catch (err) {
      setSubmitError('We could not reach the server. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Order confirmed screen ---
  if (orderNumber) {
    return (
      <div className="container mx-auto px-6 py-24 text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m20 6-11 11-5-5" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-bold text-nirmal-dark mb-3">Order Placed Successfully!</h1>
        <p className="text-nirmal-dark/70 mb-6">
          Thank you for shopping with Nirmal Masale. Your spices are being prepared with care.
        </p>
        <div className="bg-white border border-nirmal-gold/40 rounded-2xl p-6 mb-8">
          <p className="text-xs uppercase text-nirmal-dark/50 font-semibold mb-1">Your Tracking Number</p>
          <p className="font-serif text-2xl font-bold text-nirmal-maroon tracking-wide">{orderNumber}</p>
          <p className="text-xs text-nirmal-dark/50 mt-2">Save this number to track your order status anytime.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/track-order`} className="bg-nirmal-maroon text-nirmal-cream px-6 py-3 rounded-xl font-semibold hover:bg-nirmal-maroon-dark transition-all">
            Track This Order
          </Link>
          <Link href="/shop" className="border border-nirmal-maroon/30 text-nirmal-maroon px-6 py-3 rounded-xl font-semibold hover:bg-nirmal-maroon/5 transition-all">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // --- Empty cart guard ---
  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-6 py-24 text-center max-w-lg">
        <h1 className="font-serif text-3xl font-bold text-nirmal-dark mb-4">Your Cart is Empty</h1>
        <p className="text-nirmal-dark/70 mb-8">You need to add some spices to your cart before you can checkout.</p>
        <Link href="/shop" className="bg-nirmal-maroon text-nirmal-cream px-8 py-3 rounded-xl font-semibold hover:bg-nirmal-maroon-dark transition-all">
          Return to Shop
        </Link>
      </div>
    );
  }

  const inputClass = (hasError?: string) =>
    `w-full border rounded-xl px-4 py-3 bg-[#f9f0e6]/30 focus:outline-none focus:border-nirmal-maroon transition-colors ${
      hasError ? 'border-red-400' : 'border-nirmal-dark/20'
    }`;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-nirmal-dark mb-8">Secure Checkout</h1>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Shipping Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-nirmal-maroon/10 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-nirmal-maroon mb-6">Shipping Details</h2>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-nirmal-dark/70 uppercase block mb-2">First Name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className={inputClass(errors.firstName)}
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-nirmal-dark/70 uppercase block mb-2">Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className={inputClass(errors.lastName)}
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-nirmal-dark/70 uppercase block mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={inputClass(errors.email)}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-nirmal-dark/70 uppercase block mb-2">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="10-digit mobile number"
                  className={inputClass(errors.phone)}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-nirmal-dark/70 uppercase block mb-2">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                className={inputClass(errors.address)}
                rows={3}
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-nirmal-dark/70 uppercase block mb-2">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={inputClass(errors.city)}
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-nirmal-dark/70 uppercase block mb-2">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className={inputClass(errors.state)}
                />
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-nirmal-dark/70 uppercase block mb-2">Pincode</label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => updateField('pincode', e.target.value)}
                  className={inputClass(errors.pincode)}
                />
                {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
              </div>
            </div>

            {/* Payment method */}
            <div>
              <label className="text-xs font-semibold text-nirmal-dark/70 uppercase block mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateField('paymentMethod', 'cod')}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium text-left transition-all ${
                    form.paymentMethod === 'cod'
                      ? 'border-nirmal-maroon bg-nirmal-maroon/5 text-nirmal-maroon'
                      : 'border-nirmal-dark/20 text-nirmal-dark hover:border-nirmal-maroon'
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => updateField('paymentMethod', 'online')}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium text-left transition-all ${
                    form.paymentMethod === 'online'
                      ? 'border-nirmal-maroon bg-nirmal-maroon/5 text-nirmal-maroon'
                      : 'border-nirmal-dark/20 text-nirmal-dark hover:border-nirmal-maroon'
                  }`}
                >
                  UPI / Card (Online)
                </button>
              </div>
            </div>

            {submitError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-nirmal-cta text-nirmal-cream font-semibold py-4 rounded-xl hover:bg-nirmal-cta-hover transition-all shadow-md mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Placing Your Order…' : `Place Order — ₹${total}`}
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 bg-nirmal-cream border border-nirmal-gold/30 p-8 rounded-2xl shadow-sm lg:sticky lg:top-24">
          <h2 className="font-serif text-xl font-bold text-nirmal-dark mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  {/* Product Image Box */}
                  <div className="w-12 h-12 bg-white border border-nirmal-maroon/10 rounded-xl relative flex-shrink-0 flex items-center justify-center overflow-hidden p-1.5">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <span className="font-bold text-xs text-nirmal-maroon">{item.quantity}x</span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-nirmal-dark">{item.name}</p>
                    <p className="text-xs text-nirmal-dark/60">{item.selectedSize} • Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-nirmal-dark">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-nirmal-dark/10 pt-4 space-y-3 text-sm">
            <div className="flex justify-between text-nirmal-dark/70">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-nirmal-dark/70">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between font-serif text-2xl font-bold text-nirmal-maroon pt-4 border-t border-nirmal-dark/10">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-nirmal-dark/10 flex items-center gap-2 text-xs text-nirmal-dark/50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
            Your information is used only to process this order.
          </div>
        </div>
      </div>
    </div>
  );
}