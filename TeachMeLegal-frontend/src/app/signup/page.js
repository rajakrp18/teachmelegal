"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { 
  IconCheckCircle, 
  IconGraduationCap, 
  IconBookOpen, 
  IconVideo, 
  IconCreditCard, 
  IconLock,
  IconArrowUpRight
} from '../../components/Icons';
import '../auth.css';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const { loginUser } = useCart();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to create account. Please try again.');
        return;
      }

      // Log user in automatically
      loginUser(data.user, [], []);
      setSuccess(true);
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Unable to reach server.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-success-screen">
          <div className="auth-success-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconCheckCircle size={52} style={{ color: 'var(--accent-gold)' }} />
          </div>
          <h2>Welcome to TeachMeLegal!</h2>
          <p>Your scholar account for <strong>{form.email}</strong> is ready. Start exploring courses and comprehensive judicial notes.</p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '24px' }}>
            <Link href="/account" className="auth-submit-btn" style={{ padding: '12px 24px' }}>
              Go to My Account →
            </Link>
            <Link href="/courses" className="auth-submit-btn" style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)' }}>
              Explore Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <Link href="/" className="auth-logo">
            <Image src="/logo.png" alt="Teach Me Legal" width={60} height={60} style={{ width: 'auto', height: 'auto' }} priority />
            <span>Teach Me <b>Legal</b></span>
          </Link>
          <h2 className="auth-left-title">Start Your Legal Education Journey Today</h2>
          <p className="auth-left-sub">Join thousands of students learning law the right way</p>
          <div className="auth-benefits">
            <div className="auth-benefit">
              <IconGraduationCap size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} /> Courses by a Supreme Court Advocate
            </div>
            <div className="auth-benefit">
              <IconBookOpen size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} /> 50+ books & study notes available
            </div>
            <div className="auth-benefit">
              <IconVideo size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} /> Free YouTube lecture access & statutory notes
            </div>
            <div className="auth-benefit">
              <IconCreditCard size={18} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} /> Secure payments & instant PDF downloads
            </div>
          </div>
        </div>
        <div className="auth-left-pattern" />
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Join India's premier legal education platform</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Raj Poddar" 
                className="auth-input" 
                required 
              />
            </div>
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
              <label className="auth-label">Phone Number (Optional)</label>
              <input 
                type="tel" 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                placeholder="+91 98765 43210" 
                className="auth-input" 
              />
            </div>
            <div className="auth-field-row">
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  className="auth-input" 
                  required 
                  minLength={6} 
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirm" 
                  value={form.confirm} 
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  className="auth-input" 
                  required 
                />
              </div>
            </div>

            <p className="auth-terms">
              By signing up, you agree to our <Link href="/privacy">Privacy Policy</Link> and <Link href="/refund">Terms of Service</Link>.
            </p>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Create Account <IconArrowUpRight size={15} />
                </span>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link href="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
