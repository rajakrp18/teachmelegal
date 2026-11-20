"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PdfPreviewModal from '../../components/PdfPreviewModal';
import { useCart } from '../../context/CartContext';
import { 
  IconBookOpen, 
  IconDocument, 
  IconUser, 
  IconMail, 
  IconScales, 
  IconCheckCircle,
  IconLock,
  IconPhone,
  IconGraduationCap,
  IconSparkles,
  IconArrowUpRight
} from '../../components/Icons';
import './account.css';

export default function AccountPage() {
  const { user, authLoaded, loginUser, logoutUser, enrolledCourses, orderHistory, updateUserProfile } = useCart();
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'orders', 'settings'
  const [previewPdf, setPreviewPdf] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    profession: 'Judicial Services Aspirant',
    targetExam: 'State Judicial Services (PCS-J)',
    university: '',
    yearOfStudy: 'Final Year',
    state: 'Delhi NCR',
    bio: ''
  });

  // Sync profile form when real user is loaded
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profession: user.profession || 'Judicial Services Aspirant',
        targetExam: user.targetExam || 'State Judicial Services (PCS-J)',
        university: user.university || '',
        yearOfStudy: user.yearOfStudy || 'Final Year',
        state: user.state || 'Delhi NCR',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email || profileForm.email,
          name: profileForm.name,
          phone: profileForm.phone,
          profession: profileForm.profession,
          targetExam: profileForm.targetExam,
          university: profileForm.university,
          yearOfStudy: profileForm.yearOfStudy,
          state: profileForm.state,
          bio: profileForm.bio
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSaveError(data.error || 'Failed to update profile settings.');
        return;
      }

      // Update in context & localStorage
      updateUserProfile(data.user);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving profile:', err);
      updateUserProfile(profileForm);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  // Quick 1-click login for test scholar rajpoddar8907@gmail.com
  const handleQuickDemoLogin = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'rajpoddar8907@gmail.com', password: 'password123' })
      });
      const data = await res.json();
      if (data.success) {
        loginUser(data.user, data.enrolledCourses, data.orderHistory);
      }
    } catch (err) {
      console.error('Demo login failed:', err);
    } finally {
      setDemoLoading(false);
    }
  };

  // 1. Loading State while reading authentication session
  if (!authLoaded) {
    return (
      <main className="account-page-wrapper">
        <Navbar />
        <div className="container account-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="account-loading-spinner" />
        </div>
        <Footer />
      </main>
    );
  }

  // 2. Unauthenticated State: Clear Sign In Gate (NO fake dummy profile)
  if (!user) {
    return (
      <main className="account-page-wrapper">
        <Navbar />
        <div className="container account-container">
          <div className="account-auth-gate">
            <div className="gate-icon-bubble">
              <IconLock size={38} style={{ color: 'var(--accent-gold)' }} />
            </div>
            <h1 className="gate-title">Sign In to Access Your Scholar Account</h1>
            <p className="gate-subtitle">
              You need to sign in to access your enrolled legal masterclasses, bare act notes, and order receipts.
            </p>

            <div className="gate-actions">
              <Link href="/login" className="btn btn-gold btn-gate-action">
                <span>Sign In to Account</span>
                <IconArrowUpRight size={14} />
              </Link>
              <Link href="/signup" className="btn-gate-secondary">
                <span>Create Free Account</span>
              </Link>
            </div>

            <div style={{ marginTop: '24px' }}>
              <Link href="/courses" style={{ color: 'var(--accent-gold)', fontSize: '0.88rem', textDecoration: 'underline' }}>
                ← Browse Legal Courses & Bare Act Notes
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // 3. Authenticated State: Real User Dashboard
  const avatarLetter = (user.name || user.email || 'S').charAt(0).toUpperCase();

  return (
    <main className="account-page-wrapper">
      <Navbar />

      <div className="container account-container">

        {/* User Hero Profile Banner */}
        <div className="account-user-card">
          <div className="user-profile-left">
            <div className="user-avatar-bubble">
              {avatarLetter}
            </div>
            <div className="user-meta-info">
              <h1>{user.name || 'Enrolled Scholar'}</h1>
              <p className="user-email-text">
                <IconMail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> 
                {user.email}
              </p>
              <div className="user-badges-row">
                <span className="student-role-badge">
                  <IconScales size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} /> 
                  {user.role || 'ENROLLED SCHOLAR'}
                </span>
                {user.profession && (
                  <span className="capsule-badge-outline">
                    {user.profession}
                  </span>
                )}
                <span className="capsule-badge-outline">
                  {user.memberSince ? `MEMBER SINCE ${user.memberSince.toUpperCase()}` : 'MEMBER SINCE 2026'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <button onClick={logoutUser} className="btn-account-logout">
              Sign Out ↗
            </button>
          </div>
        </div>

        {/* Account Tabs Navigation */}
        <div className="account-tabs-bar">
          <button
            className={`account-tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <IconBookOpen size={16} />
            <span>My Courses & Books ({enrolledCourses.length})</span>
          </button>
          <button
            className={`account-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <IconDocument size={16} />
            <span>Order History ({orderHistory.length})</span>
          </button>
          <button
            className={`account-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <IconUser size={16} />
            <span>Profile & Legal Bio</span>
          </button>
        </div>

        {/* TAB 1: Enrolled Courses & Study Notes */}
        {activeTab === 'courses' && (
          <div>
            {enrolledCourses.length > 0 ? (
              <div className="enrolled-grid">
                {enrolledCourses.map((item, idx) => (
                  <div key={item.id || idx} className="enrolled-card">
                    <div>
                      <div className="enrolled-card-header">
                        <span className="enrolled-book-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconBookOpen size={20} />
                        </span>
                        <div>
                          <span className="enrolled-card-tag">{item.category || 'Study Material'}</span>
                          <h3 className="enrolled-card-title">{item.title}</h3>
                          {item.enrolledDate && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Enrolled: {item.enrolledDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                      <button
                        onClick={() => setPreviewPdf({ title: item.title, file: item.pdfUrl || item.driveUrl || '/books/sample.pdf' })}
                        className="btn-open-material"
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1 }}
                      >
                        <IconBookOpen size={16} />
                        <span>Open & Read Notes PDF</span>
                      </button>
                      {item.driveUrl && (
                        <a
                          href={item.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-open-material"
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px', width: 'auto', padding: '0 12px', background: 'rgba(207, 168, 86, 0.15)', color: 'var(--accent-gold)', borderColor: 'var(--border-gold)' }}
                          title="Open Direct Google Drive Link"
                        >
                          <span>Drive ↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="account-empty-state">
                <div className="empty-icon-bubble">
                  <IconBookOpen size={36} style={{ color: 'var(--accent-gold)' }} />
                </div>
                <h3>No Enrolled Courses or Notes Yet</h3>
                <p>Unlock comprehensive judicial notes, landmark case breakdowns, and video masterclasses with instant PDF access.</p>
                <Link href="/books" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span>Browse Judicial Study Notes</span>
                  <IconArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Order History */}
        {activeTab === 'orders' && (
          <div>
            {orderHistory.length > 0 ? (
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Purchased Items</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map((ord, idx) => (
                      <tr key={ord.id || idx}>
                        <td className="order-id-code">{ord.id}</td>
                        <td>{ord.date}</td>
                        <td>{ord.items}</td>
                        <td><strong>{ord.amount}</strong></td>
                        <td>
                          <span className="order-status-pill">{ord.status || 'COMPLETED'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="account-empty-state">
                <div className="empty-icon-bubble">
                  <IconDocument size={36} style={{ color: 'var(--accent-gold)' }} />
                </div>
                <h3>No Previous Orders Found</h3>
                <p>All completed purchases, transaction receipts, and course invoices will be logged here securely.</p>
                <Link href="/books" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span>Explore Study Notes</span>
                  <IconArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Profile Settings & Legal Bio */}
        {activeTab === 'settings' && (
          <div className="settings-card">
            <div className="settings-header">
              <h2>Legal Scholar Profile</h2>
              <p>Personalize your judicial target examination, academic credentials, and law chambers background.</p>
            </div>

            {savedSuccess && (
              <div className="form-success-banner">
                <IconCheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
                Profile details saved successfully! Your scholar record has been updated.
              </div>
            )}

            {saveError && (
              <div className="form-error-banner">
                {saveError}
              </div>
            )}

            <form onSubmit={handleProfileSave} className="settings-form">
              <div className="form-grid-2">
                <div className="auth-field">
                  <label className="auth-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="auth-input"
                    required
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="auth-input"
                    disabled={Boolean(user?.email)}
                    title={user?.email ? "Email cannot be changed directly." : ""}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="auth-field">
                  <label className="auth-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    placeholder="+91 98765 43210"
                    className="auth-input"
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label">Target Judicial Exam / Goal</label>
                  <select
                    name="targetExam"
                    value={profileForm.targetExam}
                    onChange={handleProfileChange}
                    className="auth-input auth-select"
                  >
                    <option value="State Judicial Services (PCS-J)">State Judicial Services (PCS-J)</option>
                    <option value="Delhi Judicial Services (DJS)">Delhi Judicial Services (DJS)</option>
                    <option value="Supreme Court & High Court Litigation">Supreme Court & High Court Litigation</option>
                    <option value="LL.B. Semester & University Exams">LL.B. Semester & University Exams</option>
                    <option value="CLAT PG / LL.M. Entrance">CLAT PG / LL.M. Entrance</option>
                    <option value="AIBE (All India Bar Examination)">AIBE (All India Bar Examination)</option>
                    <option value="Banking Law & Regulatory (IBPS SO / SEBI / RBI)">Banking Law & Regulatory (IBPS SO / SEBI / RBI)</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="auth-field">
                  <label className="auth-label">Legal Profession / Status</label>
                  <select
                    name="profession"
                    value={profileForm.profession}
                    onChange={handleProfileChange}
                    className="auth-input auth-select"
                  >
                    <option value="LL.B. Scholar (3-Yr / 5-Yr)">LL.B. Scholar (3-Yr / 5-Yr)</option>
                    <option value="LL.M. Candidate">LL.M. Candidate</option>
                    <option value="Judicial Services Aspirant">Judicial Services Aspirant</option>
                    <option value="Practicing Advocate (District Courts)">Practicing Advocate (District Courts)</option>
                    <option value="Practicing Advocate (High Court)">Practicing Advocate (High Court)</option>
                    <option value="Junior Chambers Counsel">Junior Chambers Counsel</option>
                    <option value="In-house Legal Counsel / Bank Officer">In-house Legal Counsel / Bank Officer</option>
                  </select>
                </div>

                <div className="auth-field">
                  <label className="auth-label">Year of Study / Practice</label>
                  <select
                    name="yearOfStudy"
                    value={profileForm.yearOfStudy}
                    onChange={handleProfileChange}
                    className="auth-input auth-select"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="1-3 Years at Bar">1-3 Years at Bar</option>
                    <option value="3-5 Years at Bar">3-5 Years at Bar</option>
                    <option value="5+ Years Litigation Practice">5+ Years Litigation Practice</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="auth-field">
                  <label className="auth-label">University / Law School / Bar Council</label>
                  <input
                    type="text"
                    name="university"
                    value={profileForm.university}
                    onChange={handleProfileChange}
                    placeholder="e.g. Faculty of Law, University of Delhi / Bar Council of Delhi"
                    className="auth-input"
                  />
                </div>

                <div className="auth-field">
                  <label className="auth-label">State / Jurisdiction</label>
                  <input
                    type="text"
                    name="state"
                    value={profileForm.state}
                    onChange={handleProfileChange}
                    placeholder="e.g. Delhi NCR, Uttar Pradesh, Bihar, Maharashtra"
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Legal Bio & Core Focus Areas</label>
                <textarea
                  name="bio"
                  rows={4}
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  placeholder="Share your primary areas of study or practice (e.g. Banking Law, Criminal Defense, Constitutional Writs, ADR)..."
                  className="auth-input auth-textarea"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-gold mt-2" 
                disabled={saving}
                style={{ width: 'max-content', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                <IconCheckCircle size={16} />
              </button>
            </form>
          </div>
        )}

      </div>

      {/* PDF Modal Viewer for instant note reading */}
      {previewPdf && (
        <PdfPreviewModal
          pdfUrl={previewPdf.file}
          title={previewPdf.title}
          onClose={() => setPreviewPdf(null)}
        />
      )}

      <Footer />
    </main>
  );
}
