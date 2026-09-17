"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import '../auth.css';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords don't match!");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-success-screen">
          <div className="auth-success-icon">🎉</div>
          <h2>Account Created!</h2>
          <p>Welcome to Teach Me Legal. Start your legal learning journey today.</p>
          <Link href="/courses" className="auth-submit-btn" style={{ display: 'inline-block', marginTop: '20px' }}>
            Explore Courses →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <Link href="/" className="auth-logo">
            <Image src="/logo.png" alt="Teach Me Legal" width={60} height={60} style={{ width: 'auto', height: 'auto' }} />
            <span>Teach Me <b>Legal</b></span>
          </Link>
          <h2 className="auth-left-title">Start Your Legal Education Journey Today</h2>
          <p className="auth-left-sub">Join thousands of students learning law the right way</p>
          <div className="auth-benefits">
            <div className="auth-benefit">🎓 Courses by a Supreme Court Advocate</div>
            <div className="auth-benefit">📚 50+ books & study notes available</div>
            <div className="auth-benefit">🎬 Free YouTube lecture access</div>
            <div className="auth-benefit">💳 Exclusive member discounts</div>
          </div>
        </div>
        <div className="auth-left-pattern" />
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">Join India's premier legal education platform</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Priya Sharma" className="auth-input" required />
            </div>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="auth-input" required />
            </div>
            <div className="auth-field">
              <label className="auth-label">Phone Number</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="auth-input" />
            </div>
            <div className="auth-field-row">
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="auth-input" required minLength={8} />
              </div>
              <div className="auth-field">
                <label className="auth-label">Confirm Password</label>
                <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="••••••••" className="auth-input" required />
              </div>
            </div>

            <p className="auth-terms">
              By signing up, you agree to our <Link href="/privacy">Privacy Policy</Link> and <Link href="/refund">Terms of Service</Link>.
            </p>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <div className="auth-social-btns">
            <button className="auth-social-btn google">
              <span>🇬</span> Continue with Google
            </button>
          </div>

          <p className="auth-switch">
            Already have an account? <Link href="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
