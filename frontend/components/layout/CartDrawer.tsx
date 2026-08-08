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

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-nirmal-cream shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 bg-nirmal-maroon text-nirmal-cream flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold tracking-wide">Your Spice Cart</h2>
            <button 
              onClick={onClose}
              className="text-nirmal-cream/80 hover:text-white text-xl font-bold p-1"
            >
              &times;
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-nirmal-dark/60">
                <p className="font-serif text-lg mb-2">Your cart is empty</p>
                <p className="text-sm">Explore our stone-ground spice collection to add items.</p>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={`${item.id}-${item.selectedSize}`} 
                  className="bg-white p-4 rounded-xl border border-nirmal-maroon/10 shadow-sm flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-[#f9f0e6] rounded-xl relative flex-shrink-0 flex items-center justify-center overflow-hidden border border-nirmal-maroon/10 p-2">
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

                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-nirmal-dark text-sm mb-1">{item.name}</h3>
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
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-nirmal-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, 1)}
                          className="px-2 py-0.5 text-xs text-nirmal-dark hover:bg-nirmal-maroon hover:text-white"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id, item.selectedSize)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium p-1"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-nirmal-maroon/10 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-nirmal-dark/70 font-medium text-sm">Subtotal</span>
                <span className="font-serif text-2xl font-bold text-nirmal-maroon">₹{subtotal}</span>
              </div>
              <p className="text-xs text-nirmal-dark/50 mb-6">Shipping & taxes calculated at checkout.</p>
              
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full bg-nirmal-gold text-nirmal-dark font-semibold py-3.5 rounded-xl hover:bg-nirmal-gold/90 transition-all shadow-md block text-center"
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