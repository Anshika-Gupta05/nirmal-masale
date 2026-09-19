'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import CartDrawer from './CartDrawer';

interface CartItem {
  id: string;
  name: string;
  selectedSize: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, size: string, delta: number) => void;
  removeItem: (id: string, size: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  cartCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = 'nirmal-masale-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate cart from localStorage on first mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore corrupt/blocked storage — start with an empty cart
    }
  }, []);

  // Persist cart whenever it changes
  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be unavailable (private browsing, etc.) — fail silently
    }
  }, [items, mounted]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === newItem.id && item.selectedSize === newItem.selectedSize
      );
      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id && item.selectedSize === newItem.selectedSize
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
    setIsDrawerOpen(true);
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.selectedSize === size) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string, size: string) => {
    setItems((prev) => prev.filter((item) => !(item.id === id && item.selectedSize === size)));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        cartCount,
        subtotal,
      }}
    >
      {children}
      {mounted && (
        <CartDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          items={items}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}