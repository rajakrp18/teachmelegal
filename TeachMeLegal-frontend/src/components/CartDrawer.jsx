"use client";
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { IconShoppingBag, IconTrash } from './Icons';
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

  const router = require('next/navigation').useRouter();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconShoppingBag size={20} style={{ color: 'var(--accent-gold)' }} />
            Shopping Cart ({totalCount})
          </h3>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        {hasDiscount && (
          <div className="cart-discount-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconSparkles size={16} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
            <span><strong>10% Discount Applied!</strong> You added 3+ study notes to cart.</span>
          </div>
        )}

        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon" style={{ display: 'inline-flex', color: 'var(--accent-gold)', marginBottom: '12px' }}>
                <IconShoppingBag size={48} />
              </span>
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
                  <button onClick={() => removeFromCart(item.id)} className="cart-remove-btn" title="Remove" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconTrash size={16} />
                  </button>
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
