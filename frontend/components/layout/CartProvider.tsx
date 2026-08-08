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
  openDrawer: () => void;
  closeDrawer: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeItem,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        cartCount,
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