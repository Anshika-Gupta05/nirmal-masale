'use client';

import { useCart } from '@/components/layout/CartProvider';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, cartCount } = useCart();
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 300 ? 0 : 50;
  const total = subtotal + shipping;

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-6 py-24 text-center max-w-lg">
        <h1 className="font-serif text-3xl font-bold text-nirmal-dark mb-4">Your Cart is Empty</h1>
        <p className="text-nirmal-dark/70 mb-8">You need to add some spices to your cart before you can checkout.</p>
        <Link href="/shop" className="bg-nirmal-maroon text-nirmal-cream px-8 py-3 rounded-xl font-semibold hover:bg-nirmal-maroon/90 transition-all">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-nirmal-dark mb-8">Secure Checkout</h1>
      
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Shipping Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-nirmal-maroon/10 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-nirmal-maroon mb-6">Shipping Details</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-nirmal-dark/70 uppercase block mb-2">First Name</label>
                <input type="text" className="w-full border border-nirmal-dark/20 rounded-xl px-4 py-3 bg-[#f9f0e6]/30 focus:outline-none focus:border-nirmal-maroon" />
              </div>
              <div>
                <label className="text-xs font-semibold text-nirmal-dark/70 uppercase block mb-2">Last Name</label>
                <input type="text" className="w-full border border-nirmal-dark/20 rounded-xl px-4 py-3 bg-[#f9f0e6]/30 focus:outline-none focus:border-nirmal-maroon" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-nirmal-dark/70 uppercase block mb-2">Address</label>
              <textarea className="w-full border border-nirmal-dark/20 rounded-xl px-4 py-3 bg-[#f9f0e6]/30 focus:outline-none focus:border-nirmal-maroon" rows={3}></textarea>
            </div>
            <button type="button" className="w-full bg-nirmal-cta text-nirmal-cream font-semibold py-4 rounded-xl hover:bg-nirmal-cta/90 transition-all shadow-md mt-4">
              Proceed to Payment
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 bg-nirmal-cream border border-nirmal-gold/30 p-8 rounded-2xl shadow-sm">
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
        </div>
      </div>
    </div>
  );
}