"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PdfPreviewModal from '../../components/PdfPreviewModal';
import { useCart } from '../../context/CartContext';
import './account.css';

export default function AccountPage() {
  const { user, logoutUser } = useCart();
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'orders', 'settings'
  const [previewPdf, setPreviewPdf] = useState(null);

  // Default fallback user profile if not signed in via Firebase/CartContext yet
  const student = user || {
    name: 'Law Student',
    email: 'student@teachmelegal.com',
    memberSince: 'September 2026',
  };

  // Sample active enrolled courses & books
  const enrolledItems = [
    {
      id: 'pmla-2002',
      title: 'Prevention of Money Laundering Act, 2002',
      category: 'Exam Notes',
      pdfUrl: '/books/sample.pdf',
    },
    {
      id: 'jurisprudence-notes',
      title: 'Jurisprudence & Legal Theory Notes',
      category: 'Judiciary Revision',
      pdfUrl: '/books/sample.pdf',
    },
    {
      id: 'banking-law-notes',
      title: 'Banking Law & Case Studies Guide',
      category: 'Video Course & Handbook',
      pdfUrl: '/books/sample.pdf',
    },
  ];

  // Sample order history
  const orderHistory = [
    {
      id: 'TML-ORD-9842',
      date: '20 Sep 2026',
      items: 'Prevention of Money Laundering Act, 2002',
      amount: '₹99.00',
      status: 'PAID',
    },
    {
      id: 'TML-ORD-8711',
      date: '14 Sep 2026',
      items: 'Jurisprudence Notes + Banking Law',
      amount: '₹144.00',
      status: 'PAID',
    },
  ];

  const [profileForm, setProfileForm] = useState({
    name: student.name,
    email: student.email,
    phone: '+91 98765 43210',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <main className="account-page-wrapper">
      <Navbar />

      <div className="container account-container">

        {/* User Hero Profile Banner */}
        <div className="account-user-card">
          <div className="user-profile-left">
            <div className="user-avatar-bubble">
              {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="user-meta-info">
              <h1>{student.name}</h1>
              <p className="user-email-text">✉️ {student.email}</p>
              <div className="user-badges-row">
                <span className="student-role-badge">⚖️ ENROLLED SCHOLAR</span>
                <span className="capsule-badge-outline">MEMBER SINCE 2026</span>
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
          >
            📚 My Courses & Books ({enrolledItems.length})
          </button>
          <button
            className={`account-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            🧾 Order History ({orderHistory.length})
          </button>
          <button
            className={`account-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Profile & Settings
          </button>
        </div>

        {/* TAB 1: Enrolled Courses & Study Notes */}
        {activeTab === 'courses' && (
          <div className="enrolled-grid">
            {enrolledItems.map((item) => (
              <div key={item.id} className="enrolled-card">
                <div>
                  <div className="enrolled-card-header">
                    <span className="enrolled-book-icon">📖</span>
                    <div>
                      <span className="enrolled-card-tag">{item.category}</span>
                      <h3 className="enrolled-card-title">{item.title}</h3>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewPdf({ title: item.title, file: item.pdfUrl })}
                  className="btn-open-material"
                >
                  📖 Open & Read Notes PDF
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Order History */}
        {activeTab === 'orders' && (
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
                {orderHistory.map((ord) => (
                  <tr key={ord.id}>
                    <td className="order-id-code">{ord.id}</td>
                    <td>{ord.date}</td>
                    <td>{ord.items}</td>
                    <td><strong>{ord.amount}</strong></td>
                    <td>
                      <span className="order-status-pill">COMPLETED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: Profile Settings */}
        {activeTab === 'settings' && (
          <div className="settings-card">
            {savedSuccess && (
              <div className="form-success-banner mb-4">
                ✅ Profile settings updated successfully!
              </div>
            )}
            <form onSubmit={handleProfileSave} className="settings-form">
              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="auth-input"
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="auth-input"
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Phone Number</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="auth-input"
                />
              </div>

              <button type="submit" className="btn btn-gold mt-2" style={{ width: 'max-content' }}>
                <span>Save Profile Changes</span>
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
