"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  IconUsers, 
  IconGraduationCap, 
  IconBookOpen, 
  IconCheckCircle, 
  IconSearch, 
  IconArrowUpRight,
  IconScales 
} from '../../components/Icons';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.success) {
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error('Failed to load scholars:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.targetExam && u.targetExam.toLowerCase().includes(q)) ||
      (u.profession && u.profession.toLowerCase().includes(q)) ||
      (u.state && u.state.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q))
    );
  });

  const totalEnrollments = users.reduce((acc, u) => acc + (u.enrolledCourses?.length || 0), 0);
  const totalOrders = users.reduce((acc, u) => acc + (u.orderHistory?.length || 0), 0);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-header-title">Enrolled Scholars & User Targeting</h1>
          <p className="admin-header-subtitle">
            Inspect legal profiles, target judicial services exams, study note enrollments, and outreach details.
          </p>
        </div>
        <div className="admin-header-actions">
          <div className="admin-search-wrapper">
            <span className="search-icon"><IconSearch size={16} /></span>
            <input
              type="text"
              placeholder="Search by name, exam, phone, state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
            />
          </div>
        </div>
      </header>

      <main className="admin-content">
        {/* Quick Stats Grid */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{users.length}</div>
              <div className="admin-stat-label">Registered Scholars</div>
              <div className="admin-stat-trend">Platform Users</div>
            </div>
            <div className="admin-stat-icon-wrap gold">
              <IconUsers size={24} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{totalEnrollments}</div>
              <div className="admin-stat-label">Course Enrollments</div>
              <div className="admin-stat-trend">Study Materials Unlocked</div>
            </div>
            <div className="admin-stat-icon-wrap blue">
              <IconGraduationCap size={24} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{totalOrders}</div>
              <div className="admin-stat-label">Completed Transactions</div>
              <div className="admin-stat-trend">Verified Invoices</div>
            </div>
            <div className="admin-stat-icon-wrap green">
              <IconBookOpen size={24} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">100%</div>
              <div className="admin-stat-label">Targeting Readiness</div>
              <div className="admin-stat-trend">Exam, Phone & University Data</div>
            </div>
            <div className="admin-stat-icon-wrap purple">
              <IconScales size={24} />
            </div>
          </div>
        </div>

        {/* Scholars Table Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Enrolled Scholars Directory ({filteredUsers.length})</h2>
              <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-sub)' }}>
                Target individual law students and practitioners based on their judiciary goals.
              </span>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Scholar Profile</th>
                  <th>Contact Info</th>
                  <th>Target Judicial Exam / Role</th>
                  <th>University & State</th>
                  <th>Enrolled Items</th>
                  <th>Total Orders</th>
                  <th>Outreach Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                      <div className="admin-loading-spinner" style={{ margin: '0 auto 12px' }} />
                      Loading legal scholar profiles...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-sub)' }}>
                      No scholars found matching "{search}".
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const avatarLetter = (u.name || u.email || 'S').charAt(0).toUpperCase();
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="admin-scholar-avatar">
                              {avatarLetter}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--admin-text-main)' }}>{u.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)' }}>ID: {u.id}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{u.email}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--admin-gold)' }}>{u.phone || 'No phone'}</div>
                        </td>

                        <td>
                          <span className="badge badge-exam">{u.targetExam || 'Judiciary Aspirant'}</span>
                          <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-sub)', marginTop: '4px' }}>
                            {u.profession || 'Law Student'}
                          </div>
                        </td>

                        <td>
                          <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{u.university || 'Not specified'}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-sub)' }}>{u.state || 'India'}</div>
                        </td>

                        <td>
                          <span className="badge badge-published">
                            {u.enrolledCourses?.length || 0} active notes
                          </span>
                        </td>

                        <td>
                          <span className="badge badge-orders">
                            {u.orderHistory?.length || 0} orders
                          </span>
                        </td>

                        <td>
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="admin-btn admin-btn-primary"
                            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                          >
                            Target / Inspect 🎯
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Targeting & Outreach Modal */}
      {selectedUser && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="admin-scholar-avatar large">
                  {(selectedUser.name || selectedUser.email || 'S').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{selectedUser.name}</h2>
                  <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--admin-text-sub)' }}>
                    {selectedUser.email} • Joined {selectedUser.memberSince}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="admin-modal-close">✕</button>
            </div>

            {/* Quick Outreach Targeting Action Buttons */}
            <div className="admin-targeting-bar">
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--admin-gold)' }}>
                Targeting Channels:
              </span>
              <button 
                onClick={() => copyToClipboard(selectedUser.phone || selectedUser.email)}
                className="admin-btn-pill"
              >
                {copiedPhone ? '✓ Phone Copied!' : `📞 Call / WhatsApp: ${selectedUser.phone || 'N/A'}`}
              </button>
              <a 
                href={`mailto:${selectedUser.email}?subject=Exclusive Judicial Mentorship - TeachMeLegal`}
                className="admin-btn-pill"
              >
                ✉️ Send Judicial Guidance Email
              </a>
            </div>

            {/* Profile Grid */}
            <div className="admin-modal-section">
              <h3 className="admin-modal-section-title">Judicial Scholar Credentials</h3>
              <div className="admin-details-grid">
                <div><strong>Target Examination:</strong> <span>{selectedUser.targetExam || 'N/A'}</span></div>
                <div><strong>Current Legal Status:</strong> <span>{selectedUser.profession || 'N/A'}</span></div>
                <div><strong>University / Law School:</strong> <span>{selectedUser.university || 'N/A'}</span></div>
                <div><strong>Year of Study / Bar:</strong> <span>{selectedUser.yearOfStudy || 'N/A'}</span></div>
                <div><strong>State / Jurisdiction:</strong> <span>{selectedUser.state || 'N/A'}</span></div>
                <div><strong>Verified Role:</strong> <span className="badge badge-published">{selectedUser.role}</span></div>
              </div>
              {selectedUser.bio && (
                <div className="admin-bio-box">
                  <strong>Scholar Focus & Chambers Bio:</strong>
                  <p style={{ margin: '4px 0 0', lineHeight: 1.5 }}>{selectedUser.bio}</p>
                </div>
              )}
            </div>

            {/* Enrolled Courses */}
            <div className="admin-modal-section">
              <h3 className="admin-modal-section-title">
                Enrolled Notes & Masterclasses ({selectedUser.enrolledCourses?.length || 0})
              </h3>
              {(!selectedUser.enrolledCourses || selectedUser.enrolledCourses.length === 0) ? (
                <p style={{ fontSize: '0.88rem', color: 'var(--admin-text-sub)' }}>No study materials enrolled yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedUser.enrolledCourses.map((c, i) => (
                    <div key={i} className="admin-item-row">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-sub)' }}>
                          {c.category} • Enrolled: {c.enrolledDate}
                        </div>
                      </div>
                      <span className="badge badge-published">Active Access</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order History */}
            <div className="admin-modal-section">
              <h3 className="admin-modal-section-title">
                Purchase History & Receipts ({selectedUser.orderHistory?.length || 0})
              </h3>
              {(!selectedUser.orderHistory || selectedUser.orderHistory.length === 0) ? (
                <p style={{ fontSize: '0.88rem', color: 'var(--admin-text-sub)' }}>No past purchase transactions.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedUser.orderHistory.map((o, i) => (
                    <div key={i} className="admin-item-row">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{o.id} • {o.amount}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-sub)' }}>
                          {o.items} • {o.date}
                        </div>
                      </div>
                      <span className="badge badge-orders">{o.status || 'PAID'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button onClick={() => setSelectedUser(null)} className="admin-btn admin-btn-primary">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
