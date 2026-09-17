"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Load cart & user from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('tml_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedUser = localStorage.getItem('tml_user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (err) {
      console.error('Failed to load cart/user state:', err);
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('tml_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCartItems([]);

  // Calculate totals & discounts
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const rawSubtotal = cartItems.reduce((acc, item) => {
    const priceNum = typeof item.numericPrice === 'number' ? item.numericPrice : parseFloat(String(item.salePrice || item.price).replace(/[^0-9.]/g, '') || 0);
    return acc + priceNum * item.quantity;
  }, 0);

  // Check 3+ notes rule for 10% discount
  const notesCount = cartItems
    .filter((item) => item.category === 'Exam Material' || item.category === 'Question Bank' || item.category === 'Revision Chart' || item.category === 'Subject wise Notes')
    .reduce((acc, item) => acc + item.quantity, 0);

  const hasDiscount = notesCount >= 3;
  const discountAmount = hasDiscount ? rawSubtotal * 0.1 : 0;
  const finalTotal = rawSubtotal - discountAmount;

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('tml_user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('tml_user');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        rawSubtotal,
        notesCount,
        hasDiscount,
        discountAmount,
        finalTotal,
        user,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
