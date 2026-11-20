"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import confetti from 'canvas-confetti';
import { IconLock } from '../../components/Icons';
import './checkout.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, rawSubtotal, hasDiscount, discountAmount, finalTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to store if cart is empty
  useEffect(() => {
    if (mounted && cartItems.length === 0 && !loading) {
      router.push('/books');
    }
  }, [mounted, cartItems, router, loading]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK failed to load. Please check your connection.");
        setLoading(false);
        return;
      }

      const orderRes = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal })
      });
      const orderData = await orderRes.json();
      
      if (!orderData.success) {
        alert("Failed to create order. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: "YOUR_RAZORPAY_KEY_HERE",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Teach Me Legal",
        description: `Payment for ${cartItems.length} items`,
        order_id: orderData.order.id,
        handler: function (response) {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          alert(`Payment Successful! Access granted to your materials.`);
          clearCart();
          router.push('/account');
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#c5a059"
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        alert('Payment Failed: ' + response.error.description);
        setLoading(false);
      });

      paymentObject.open();
    } catch (err) {
      alert('Checkout error: ' + err.message);
      setLoading(false);
    }
  };

  if (!mounted || cartItems.length === 0) return null;

  return (
    <main>
      <Navbar />
      
      <div className="checkout-page">
        <div className="checkout-container">
          
          {/* Billing Details */}
          <div className="checkout-section">
            <h1 className="checkout-title">Billing Details</h1>
            <form onSubmit={handlePayment} className="checkout-form" id="checkout-form">
              <div className="form-group">
                <label>Full Name <span style={{color: '#ef4444'}}>*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Email Address <span style={{color: '#ef4444'}}>*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="student@example.com" />
              </div>
              <div className="form-group">
                <label>Phone Number <span style={{color: '#ef4444'}}>*</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+91 9876543210" />
              </div>
              <div className="form-group">
                <label>Full Address <span style={{color: '#ef4444'}}>*</span></label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required placeholder="Street, City, State, PIN Code" />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-section">
            <h2 className="checkout-title" style={{ fontSize: '1.5rem' }}>Your Order</h2>
            
            <div className="order-items">
              {cartItems.map((item, index) => (
                <div key={index} className="summary-item">
                  <div className="summary-title">
                    {item.title} <span style={{ color: '#94a3b8' }}>x {item.quantity}</span>
                  </div>
                  <div className="summary-price">
                    ₹{(item.numericPrice || parseFloat(String(item.salePrice || item.price).replace(/[^0-9.]/g, '') || 0)) * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{rawSubtotal.toFixed(2)}</span>
              </div>
              
              {hasDiscount && (
                <div className="total-row" style={{ color: '#10b981' }}>
                  <span>10% Discount Applied</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="total-row grand-total">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form" 
              className="btn-pay-now" 
              disabled={loading}
            >
              {loading ? 'Processing...' : (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Pay with Razorpay <IconLock size={16} />
                </span>
              )}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '16px' }}>
              Your payment is securely processed.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
