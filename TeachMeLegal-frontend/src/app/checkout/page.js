"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import confetti from 'canvas-confetti';
import { IconLock, IconShieldCheck, IconCheckCircle } from '../../components/Icons';
import './checkout.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    cartItems, 
    rawSubtotal, 
    hasDiscount, 
    discountAmount, 
    finalTotal, 
    clearCart,
    user,
    addOrderAndEnroll
  } = useCart();

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
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  // Redirect to books store if cart is empty
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
      if (window.Razorpay) {
        resolve(true);
        return;
      }
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
      // 1. Create order on server
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: finalTotal,
          email: formData.email
        })
      });

      const orderData = await orderRes.json();
      
      if (!orderData.success) {
        alert("Failed to initialize order. Please try again.");
        setLoading(false);
        return;
      }

      // Check if environment has real live Razorpay key
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const hasLiveKey = Boolean(razorpayKey && razorpayKey !== 'dummy_key_id' && razorpayKey.startsWith('rzp_'));

      // If in sandbox mode without production Razorpay keys, execute server-side verification directly
      if (!hasLiveKey || orderData.isSimulation) {
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: orderData.order.id,
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_signature: 'simulation_verified',
            email: formData.email,
            items: cartItems,
            amount: finalTotal
          })
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          addOrderAndEnroll(verifyData.order, cartItems);
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          alert(`Payment Verified! Access granted to your ${cartItems.length} purchased course/material(s).`);
          router.push('/account');
          return;
        } else {
          alert('Verification failed: ' + (verifyData.error || 'Unknown error'));
          setLoading(false);
          return;
        }
      }

      // Live Razorpay Gateway Flow
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay checkout failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Teach Me Legal",
        description: `Enrollment in ${cartItems.length} Legal Course/Notes`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Server-side HMAC-SHA256 signature verification
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: formData.email,
                items: cartItems,
                amount: finalTotal
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              addOrderAndEnroll(verifyData.order, cartItems);
              confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
              alert("Payment Verified! Course access and PDF materials have been added to your Account.");
              router.push('/account');
            } else {
              alert("Payment verification failed. Please contact TeachMeLegal support.");
            }
          } catch (verErr) {
            console.error('Verification error:', verErr);
            alert("Error during payment verification: " + verErr.message);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#cfa856"
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        alert('Payment Failed: ' + (response.error?.description || 'Transaction declined.'));
        setLoading(false);
      });

      paymentObject.open();
    } catch (err) {
      console.error('Checkout error:', err);
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
            <h1 className="checkout-title">Billing & Scholar Information</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Your purchased judicial notes and handbook PDFs will be unlocked directly under this account.
            </p>

            <form onSubmit={handlePayment} className="checkout-form" id="checkout-form">
              <div className="form-group">
                <label>Full Name <span style={{color: '#ef4444'}}>*</span></label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Advocate / Scholar Name" 
                />
              </div>

              <div className="form-group">
                <label>Email Address <span style={{color: '#ef4444'}}>*</span></label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="scholar@example.com" 
                />
              </div>

              <div className="form-group">
                <label>Phone Number <span style={{color: '#ef4444'}}>*</span></label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="+91 98765 43210" 
                />
              </div>

              <div className="form-group">
                <label>City & State / Jurisdiction <span style={{color: '#ef4444'}}>*</span></label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g. New Delhi, Delhi NCR" 
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-section">
            <h2 className="checkout-title" style={{ fontSize: '1.45rem' }}>Order Summary</h2>
            
            <div className="order-items">
              {cartItems.map((item, index) => (
                <div key={index} className="summary-item">
                  <div className="summary-title">
                    {item.title} <span style={{ color: 'var(--text-muted)' }}>× {item.quantity}</span>
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
                  <span>10% Scholar Bundle Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="total-row grand-total">
                <span>Total Amount</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form" 
              className="btn-pay-now" 
              disabled={loading}
            >
              {loading ? 'Securing Access...' : (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Proceed to Secure Payment <IconLock size={16} />
                </span>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              <IconShieldCheck size={16} style={{ color: 'var(--accent-gold)' }} />
              <span>256-bit SSL Encrypted & Razorpay Verified</span>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
