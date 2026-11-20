"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { IconGoogle, IconCheckCircle } from '../../components/Icons';
import '../auth.css';

import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useCart();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Authenticate student
      loginUser({ name: form.email.split('@')[0], email: form.email });
      router.push('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <Link href="/" className="auth-logo">
            <Image src="/logo.png" alt="Teach Me Legal" width={60} height={60} style={{ width: 'auto', height: 'auto' }} />
            <span>Teach Me <b>Legal</b></span>
          </Link>
          <h2 className="auth-left-title">India's Premier Legal Learning Platform</h2>
          <p className="auth-left-sub">Join 100,000+ students learning law with Advocate Prashant Jha</p>
          <div className="auth-benefits">
            <div className="auth-benefit">
              <IconCheckCircle size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} /> Access to 50+ courses & notes
            </div>
            <div className="auth-benefit">
              <IconCheckCircle size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} /> Free YouTube lectures
            </div>
            <div className="auth-benefit">
              <IconCheckCircle size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} /> Direct download of study material
            </div>
            <div className="auth-benefit">
              <IconCheckCircle size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} /> Exclusive student discounts
            </div>
          </div>
        </div>
        <div className="auth-left-pattern" />
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account to continue learning</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="auth-input"
                required
              />
            </div>
            <div className="auth-field">
              <div className="auth-label-row">
                <label className="auth-label">Password</label>
                <Link href="/forgot-password" className="auth-forgot">Forgot password?</Link>
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="auth-input"
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>

          <div className="auth-social-btns">
            <button className="auth-social-btn google">
              <IconGoogle size={18} /> Continue with Google
            </button>
          </div>

          <p className="auth-switch">
            Don't have an account? <Link href="/signup">Sign Up Free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
