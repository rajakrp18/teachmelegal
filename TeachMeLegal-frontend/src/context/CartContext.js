"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  // Load cart, user, enrolled courses, and orders on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('tml_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedUserStr = localStorage.getItem('tml_user');
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        setUser(savedUser);

        // Load enrolled courses for this user
        const userCoursesKey = `tml_enrolled_${savedUser.email}`;
        const savedCourses = localStorage.getItem(userCoursesKey);
        if (savedCourses) {
          setEnrolledCourses(JSON.parse(savedCourses));
        } else if (Array.isArray(savedUser.enrolledCourses)) {
          setEnrolledCourses(savedUser.enrolledCourses);
          localStorage.setItem(userCoursesKey, JSON.stringify(savedUser.enrolledCourses));
        }

        // Load order history for this user
        const userOrdersKey = `tml_orders_${savedUser.email}`;
        const savedOrders = localStorage.getItem(userOrdersKey);
        if (savedOrders) {
          setOrderHistory(JSON.parse(savedOrders));
        } else if (Array.isArray(savedUser.orderHistory)) {
          setOrderHistory(savedUser.orderHistory);
          localStorage.setItem(userOrdersKey, JSON.stringify(savedUser.orderHistory));
        }
      }
    } catch (err) {
      console.error('Failed to load initial cart/user state:', err);
    } finally {
      setAuthLoaded(true);
    }
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('tml_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to sync cart:', err);
    }
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
    const priceNum = typeof item.numericPrice === 'number'
      ? item.numericPrice
      : parseFloat(String(item.salePrice || item.price).replace(/[^0-9.]/g, '') || 0);
    return acc + priceNum * item.quantity;
  }, 0);

  // Check 3+ notes rule for 10% discount
  const notesCount = cartItems
    .filter((item) =>
      item.category === 'Exam Material' ||
      item.category === 'Question Bank' ||
      item.category === 'Revision Chart' ||
      item.category === 'Subject wise Notes'
    )
    .reduce((acc, item) => acc + item.quantity, 0);

  const hasDiscount = notesCount >= 3;
  const discountAmount = hasDiscount ? rawSubtotal * 0.1 : 0;
  const finalTotal = rawSubtotal - discountAmount;

  // Authentication & State Handlers
  const loginUser = useCallback((userData, courses = [], orders = []) => {
    setUser(userData);
    try {
      localStorage.setItem('tml_user', JSON.stringify(userData));

      // Resolve courses: argument -> localStorage -> userData.enrolledCourses -> []
      const userCoursesKey = `tml_enrolled_${userData.email}`;
      let finalCourses = Array.isArray(courses) && courses.length > 0 ? courses : null;
      if (!finalCourses) {
        const stored = localStorage.getItem(userCoursesKey);
        if (stored) finalCourses = JSON.parse(stored);
      }
      if (!finalCourses && Array.isArray(userData.enrolledCourses)) {
        finalCourses = userData.enrolledCourses;
      }
      finalCourses = finalCourses || [];
      setEnrolledCourses(finalCourses);
      localStorage.setItem(userCoursesKey, JSON.stringify(finalCourses));

      // Resolve orders: argument -> localStorage -> userData.orderHistory -> []
      const userOrdersKey = `tml_orders_${userData.email}`;
      let finalOrders = Array.isArray(orders) && orders.length > 0 ? orders : null;
      if (!finalOrders) {
        const stored = localStorage.getItem(userOrdersKey);
        if (stored) finalOrders = JSON.parse(stored);
      }
      if (!finalOrders && Array.isArray(userData.orderHistory)) {
        finalOrders = userData.orderHistory;
      }
      finalOrders = finalOrders || [];
      setOrderHistory(finalOrders);
      localStorage.setItem(userOrdersKey, JSON.stringify(finalOrders));
    } catch (err) {
      console.error('Error saving user login state:', err);
    }
  }, []);

  const logoutUser = useCallback(() => {
    setUser(null);
    setEnrolledCourses([]);
    setOrderHistory([]);
    try {
      localStorage.removeItem('tml_user');
    } catch (err) {
      console.error('Error removing user session:', err);
    }
  }, []);

  const updateUserProfile = useCallback((updatedUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };
      try {
        localStorage.setItem('tml_user', JSON.stringify(merged));
      } catch (err) {
        console.error('Error updating user profile in storage:', err);
      }
      return merged;
    });
  }, []);

  // Add order and enroll courses into user account permanently
  const addOrderAndEnroll = useCallback((order, items = []) => {
    const emailKey = user?.email || 'guest';
    const userCoursesKey = `tml_enrolled_${emailKey}`;
    const userOrdersKey = `tml_orders_${emailKey}`;

    // 1. Update orders
    setOrderHistory((prevOrders) => {
      const updatedOrders = [order, ...prevOrders];
      try {
        localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));
      } catch (e) {
        console.error('Failed to persist order history:', e);
      }
      return updatedOrders;
    });

    // 2. Update enrolled courses
    setEnrolledCourses((prevCourses) => {
      const newItems = items
        .filter((item) => !prevCourses.some((c) => c.id === item.id || c.title === item.title))
        .map((item) => ({
          id: item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: item.title,
          category: item.category || 'Study Material',
          pdfUrl: item.pdfUrl || item.driveUrl || '/books/sample.pdf',
          driveUrl: item.driveUrl || '',
          enrolledDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        }));

      const updatedCourses = [...newItems, ...prevCourses];
      try {
        localStorage.setItem(userCoursesKey, JSON.stringify(updatedCourses));
      } catch (e) {
        console.error('Failed to persist enrolled courses:', e);
      }
      return updatedCourses;
    });

    // 3. Clear shopping cart
    clearCart();
  }, [user]);

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
        authLoaded,
        enrolledCourses,
        orderHistory,
        loginUser,
        logoutUser,
        updateUserProfile,
        addOrderAndEnroll
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
