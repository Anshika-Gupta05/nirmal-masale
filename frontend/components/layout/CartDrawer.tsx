'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CartItem {
  id: string;
  name: string;
  selectedSize: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, size: string, delta: number) => void;
  onRemoveItem: (id: string, size: string) => void;
}

const FREE_SHIPPING_THRESHOLD = 300;

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md bg-nirmal-cream shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="p-6 bg-nirmal-maroon text-nirmal-cream flex items-center justify-between shrink-0">
            <h2 className="font-serif text-xl font-bold tracking-wide">
              Your Spice Cart {items.length > 0 && `(${items.reduce((a, i) => a + i.quantity, 0)})`}
            </h2>
            <button
              onClick={onClose}
              className="text-nirmal-cream/80 hover:text-white text-xl font-bold p-1 leading-none"
              aria-label="Close cart"
            >
              &times;
            </button>
          </div>

          {/* Free shipping progress */}
          {items.length > 0 && (
            <div className="px-6 pt-4 pb-1 bg-white border-b border-nirmal-maroon/10 shrink-0">
              <p className="text-xs text-nirmal-dark/70 mb-2">
                {remainingForFreeShipping > 0 ? (
                  <>
                    Add <span className="font-bold text-nirmal-maroon">₹{remainingForFreeShipping}</span> more for{' '}
                    <span className="font-semibold">FREE delivery</span>
                  </>
                ) : (
                  <span className="font-semibold text-emerald-700">🎉 You&apos;ve unlocked free delivery!</span>
                )}
              </p>
              <div className="h-1.5 w-full bg-nirmal-dark/10 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-nirmal-gold rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-nirmal-dark/60 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-nirmal-maroon/10 flex items-center justify-center mb-4">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-nirmal-maroon" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <p className="font-serif text-lg mb-2 text-nirmal-dark">Your cart is empty</p>
                <p className="text-sm mb-6">Explore our stone-ground spice collection to add items.</p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="bg-nirmal-maroon text-nirmal-cream font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-nirmal-maroon-dark transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="bg-white p-4 rounded-xl border border-nirmal-maroon/10 shadow-sm flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-[#f9f0e6] rounded-xl relative shrink-0 flex items-center justify-center overflow-hidden border border-nirmal-maroon/10 p-2">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-[10px] font-serif font-bold text-nirmal-maroon">{item.selectedSize}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-nirmal-dark text-sm mb-1 truncate">{item.name}</h3>
                    <p className="text-xs text-nirmal-dark/60 mb-2">Weight: {item.selectedSize}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-nirmal-maroon text-sm">
                        ₹{item.price * item.quantity}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-nirmal-dark/20 rounded-lg overflow-hidden bg-nirmal-cream/20">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, -1)}
                          className="px-2 py-0.5 text-xs text-nirmal-dark hover:bg-nirmal-maroon hover:text-white"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-nirmal-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, 1)}
                          className="px-2 py-0.5 text-xs text-nirmal-dark hover:bg-nirmal-maroon hover:text-white"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id, item.selectedSize)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium p-1 shrink-0"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-nirmal-maroon/10 shadow-lg shrink-0">
              <div className="flex items-center justify-between mb-4">
                <span className="text-nirmal-dark/70 font-medium text-sm">Subtotal</span>
                <span className="font-serif text-2xl font-bold text-nirmal-maroon">₹{subtotal}</span>
              </div>
              <p className="text-xs text-nirmal-dark/50 mb-6">Shipping &amp; taxes calculated at checkout.</p>

              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full bg-nirmal-cta text-nirmal-cream font-semibold py-3.5 rounded-xl hover:bg-nirmal-cta-hover transition-all shadow-md block text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}