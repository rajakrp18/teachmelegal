"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { IconGoogle, IconCheckCircle, IconLock, IconEye, IconEyeOff } from '../../components/Icons';
import '../auth.css';

import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useCart();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid email or password. Please try again.');
        return;
      }

      // Successful authentication
      loginUser(data.user, data.enrolledCourses, data.orderHistory);
      router.push('/account');
    } catch (err) {
      console.error('Login request failed:', err);
      setError('Unable to reach authentication server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <Link href="/" className="auth-logo">
            <Image src="/logo.png" alt="Teach Me Legal" width={60} height={60} style={{ width: 'auto', height: 'auto' }} priority />
            <span>Teach Me <b>Legal</b></span>
          </Link>
          <h2 className="auth-left-title">India's Premier Legal Learning Platform</h2>
          <p className="auth-left-sub">Join 100,000+ students learning law with Advocate Prashant Jha</p>
          <div className="auth-benefits">
            <div className="auth-benefit">
              <IconCheckCircle size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} /> Access to 50+ courses & notes
            </div>
            <div className="auth-benefit">
              <IconCheckCircle size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} /> Free YouTube lectures & updates
            </div>
            <div className="auth-benefit">
              <IconCheckCircle size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} /> Direct download of study material & notes
            </div>
            <div className="auth-benefit">
              <IconCheckCircle size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} /> Permanent access to enrolled items
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
              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="auth-input auth-password-input"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Sign In <IconLock size={15} />
                </span>
              )}
            </button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>

          <div className="auth-social-btns">
            <button 
              type="button" 
              className="auth-social-btn google"
              onClick={() => alert("Google Sign-In integration is enabled for production domain.")}
            >
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
