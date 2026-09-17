"use client";
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalCount,
    rawSubtotal,
    hasDiscount,
    discountAmount,
    finalTotal,
    clearCart,
    user
  } = useCart();

  const [loading, setLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);

    try {
      // Trigger festive confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      alert(`🎉 Payment Successful! Order placed for ₹${finalTotal.toFixed(2)}. Access granted to study portal!`);
      clearCart();
      setIsCartOpen(false);
    } catch (err) {
      alert('Checkout error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3>🛒 Shopping Cart ({totalCount})</h3>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        {hasDiscount && (
          <div className="cart-discount-banner">
            🎉 <strong>10% Discount Applied!</strong> You added 3+ study notes to cart.
          </div>
        )}

        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <span style={{ fontSize: '3rem' }}>🛍️</span>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.title}</h4>
                  <span className="cart-item-cat">{item.category}</span>
                  <div className="cart-item-price">
                    ₹{item.numericPrice || parseFloat(String(item.salePrice || item.price).replace(/[^0-9.]/g, '') || 0)}
                  </div>
                </div>

                <div className="cart-item-controls">
                  <button onClick={() => updateQuantity(item.id, -1)} className="cart-qty-btn">-</button>
                  <span className="cart-qty">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="cart-qty-btn">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="cart-remove-btn" title="Remove">🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span>₹{rawSubtotal.toFixed(2)}</span>
            </div>

            {hasDiscount && (
              <div className="cart-summary-line discount">
                <span>10% Discount (3+ Notes Offer)</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="cart-summary-line total">
              <span>Total Amount</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-primary cart-checkout-btn"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
