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
  const [examFilter, setExamFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedUser) {
        setSelectedUser(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedUser]);

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

  const parseUserDate = (dateStr) => {
    if (!dateStr) return null;
    const months = {
      january: 0, jan: 0,
      february: 1, feb: 1,
      march: 2, mar: 2,
      april: 3, apr: 3,
      may: 4,
      june: 5, jun: 5,
      july: 6, jul: 6,
      august: 7, aug: 7,
      september: 8, sep: 8,
      october: 9, oct: 9,
      november: 10, nov: 10,
      december: 11, dec: 11
    };
    const parts = dateStr.toLowerCase().split(/[\s,]+/);
    if (parts.length >= 2) {
      let month = -1, year = -1, day = 1;
      for (const p of parts) {
        if (months[p] !== undefined) month = months[p];
        else if (/^\d{4}$/.test(p)) year = parseInt(p, 10);
        else if (/^\d{1,2}$/.test(p)) day = parseInt(p, 10);
      }
      if (month !== -1 && year !== -1) return new Date(year, month, day);
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.targetExam && u.targetExam.toLowerCase().includes(q)) ||
      (u.profession && u.profession.toLowerCase().includes(q)) ||
      (u.university && u.university.toLowerCase().includes(q)) ||
      (u.state && u.state.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.id && u.id.toLowerCase().includes(q));

    const matchesExam = 
      examFilter === 'ALL' || 
      (u.targetExam && u.targetExam.toLowerCase().includes(examFilter.toLowerCase()));

    let matchesDate = true;
    const userDate = parseUserDate(u.memberSince);

    if (userDate) {
      if (startDate) {
        const start = new Date(`${startDate}T00:00:00`);
        if (userDate < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(`${endDate}T23:59:59`);
        if (userDate > end) matchesDate = false;
      }
    }

    return matchesSearch && matchesExam && matchesDate;
  });

  const hasActiveFilters = Boolean(search || examFilter !== 'ALL' || startDate || endDate);

  const handleResetFilters = () => {
    setSearch('');
    setExamFilter('ALL');
    setStartDate('');
    setEndDate('');
  };

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
          <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '18px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 className="admin-card-title" style={{ margin: 0 }}>Enrolled Scholars Directory</h2>
                <span className="badge badge-exam" style={{ fontSize: '0.8rem' }}>
                  {filteredUsers.length} {filteredUsers.length === 1 ? 'scholar' : 'scholars'}
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--admin-text-sub)' }}>
                Target individual law students and practitioners based on their judiciary goals.
              </p>
            </div>

            {hasActiveFilters && (
              <button 
                type="button" 
                onClick={handleResetFilters} 
                className="admin-btn-reset"
                title="Reset search and date filters"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Dedicated Search & Date Filter Bar positioned right above the table */}
          <div style={{ padding: '16px 24px', background: 'rgba(0, 0, 0, 0.015)', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div className="admin-search-wrapper" style={{ flex: '1 1 260px', minWidth: '220px' }}>
              <span className="search-icon"><IconSearch size={16} /></span>
              <input
                type="text"
                placeholder="Search scholars by name, phone, email, university, state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-search-input"
                style={{ width: '100%' }}
              />
            </div>

            {/* Target Judicial Exam Select */}
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="admin-select"
              style={{ minWidth: '180px' }}
            >
              <option value="ALL">All Judicial Exams</option>
              <option value="PCS-J">State Judicial (PCS-J)</option>
              <option value="DJS">Delhi Judicial (DJS)</option>
              <option value="UP HJS">UP Higher Judicial (UP HJS)</option>
              <option value="Aspirant">Judiciary Aspirants</option>
            </select>

            {/* Proper Date Filter: From Date to That Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div className="admin-date-picker-wrap">
                <label>From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="admin-date-input"
                  title="Filter scholars joined on or after this date"
                />
              </div>

              <div className="admin-date-picker-wrap">
                <label>To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="admin-date-input"
                  title="Filter scholars joined on or before this date"
                />
              </div>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '55px', textAlign: 'center' }}>SL No.</th>
                  <th style={{ minWidth: '140px' }}>Scholar Profile</th>
                  <th style={{ minWidth: '160px' }}>Contact Info</th>
                  <th style={{ minWidth: '150px' }}>Target Judicial Exam / Role</th>
                  <th style={{ minWidth: '140px' }}>University & State</th>
                  <th style={{ minWidth: '95px' }}>Joined Date</th>
                  <th style={{ minWidth: '85px', textAlign: 'center' }}>Enrolled Items</th>
                  <th style={{ minWidth: '75px', textAlign: 'center' }}>Total Orders</th>
                  <th style={{ minWidth: '95px', textAlign: 'center' }}>Outreach Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '36px' }}>
                      <div className="admin-loading-spinner" style={{ margin: '0 auto 10px' }} />
                      Loading legal scholar profiles...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--admin-text-sub)' }}>
                      No scholars found matching current search and filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, idx) => {
                    const avatarLetter = (u.name || u.email || 'S').charAt(0).toUpperCase();
                    return (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 800, color: 'var(--admin-gold)', textAlign: 'center' }}>
                          #{idx + 1}
                        </td>

                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="admin-scholar-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem', flexShrink: 0 }}>
                              {avatarLetter}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--admin-text-main)', fontSize: '0.83rem' }}>{u.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-sub)' }}>ID: {u.id}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, wordBreak: 'break-all' }}>{u.email}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--admin-gold)' }}>{u.phone || 'No phone'}</div>
                        </td>

                        <td>
                          <span className="badge badge-exam" style={{ fontSize: '0.73rem', padding: '2px 7px' }}>{u.targetExam || 'Judiciary Aspirant'}</span>
                          <div style={{ fontSize: '0.73rem', color: 'var(--admin-text-sub)', marginTop: '2px' }}>
                            {u.profession || 'Law Student'}
                          </div>
                        </td>

                        <td>
                          <div style={{ fontSize: '0.81rem', fontWeight: 500 }}>{u.university || 'Not specified'}</div>
                          <div style={{ fontSize: '0.73rem', color: 'var(--admin-text-sub)' }}>{u.state || 'India'}</div>
                        </td>

                        <td style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', color: 'var(--admin-text-sub)' }}>
                          {u.memberSince || 'Sep 2026'}
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <span className="badge badge-published" style={{ fontSize: '0.73rem', padding: '2px 7px' }}>
                            {u.enrolledCourses?.length || 0} active notes
                          </span>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <span className="badge badge-orders" style={{ fontSize: '0.73rem', padding: '2px 7px' }}>
                            {u.orderHistory?.length || 0} orders
                          </span>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="admin-btn admin-btn-primary"
                            style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                          >
                            Target / Inspect
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

      {/* Targeting & Outreach Modal (Wide 2-Column Zero-Scroll Layout) */}
      {selectedUser && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div 
            className="admin-targeting-modal-card" 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '94%',
              maxWidth: '1160px',
              padding: '24px 32px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            {/* Top Bar: Scholar Profile on Left, Targeting Channels + Close on Right */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border)', paddingBottom: '16px', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="admin-scholar-avatar large" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                  {(selectedUser.name || selectedUser.email || 'S').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--admin-text-main)' }}>{selectedUser.name}</h2>
                    <span className="badge badge-published" style={{ fontSize: '0.74rem' }}>{selectedUser.role}</span>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'var(--admin-text-sub)' }}>
                    {selectedUser.email} • Joined {selectedUser.memberSince} • ID: {selectedUser.id}
                  </p>
                </div>
              </div>

              {/* Outreach Targeting Channels in Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => copyToClipboard(selectedUser.phone || selectedUser.email)}
                  className="admin-btn-pill"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 14px' }}
                >
                  <span>📞</span>
                  <span>{copiedPhone ? 'Phone Copied!' : `Call / WhatsApp: ${selectedUser.phone || 'N/A'}`}</span>
                </button>
                <a 
                  href={`mailto:${selectedUser.email}?subject=Exclusive Judicial Mentorship - TeachMeLegal`}
                  className="admin-btn-pill"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 14px' }}
                >
                  <span>✉️</span>
                  <span>Send Judicial Guidance Email</span>
                </a>
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="admin-modal-close"
                  style={{ marginLeft: '6px' }}
                  title="Close Inspector (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Main 2-Column Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '22px', alignItems: 'start' }}>
              {/* Left Column: Credentials & Bio */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="admin-modal-section" style={{ margin: 0 }}>
                  <h3 className="admin-modal-section-title" style={{ fontSize: '0.78rem', marginBottom: '8px' }}>
                    Judicial Scholar Credentials
                  </h3>
                  <div className="admin-details-grid" style={{ padding: '12px 14px', gap: '10px', fontSize: '0.83rem', borderRadius: '12px' }}>
                    <div><strong>Target Exam:</strong> <span style={{ color: 'var(--admin-gold)', fontWeight: 700 }}>{selectedUser.targetExam || 'N/A'}</span></div>
                    <div><strong>Current Status:</strong> <span>{selectedUser.profession || 'N/A'}</span></div>
                    <div><strong>Law School:</strong> <span>{selectedUser.university || 'N/A'}</span></div>
                    <div><strong>Year / Bar:</strong> <span>{selectedUser.yearOfStudy || 'N/A'}</span></div>
                    <div><strong>State:</strong> <span>{selectedUser.state || 'N/A'}</span></div>
                    <div><strong>Outreach Ready:</strong> <span style={{ color: '#10b981', fontWeight: 700 }}>Verified & Active</span></div>
                  </div>
                </div>

                {selectedUser.bio && (
                  <div className="admin-bio-box" style={{ margin: 0, padding: '12px 16px', borderRadius: '12px' }}>
                    <strong style={{ fontSize: '0.8rem', color: 'var(--admin-gold)', display: 'block', marginBottom: '4px' }}>
                      Scholar Focus & Chambers Bio:
                    </strong>
                    <p style={{ margin: 0, fontSize: '0.83rem', lineHeight: 1.5, color: 'var(--admin-text-main)' }}>{selectedUser.bio}</p>
                  </div>
                )}
              </div>

              {/* Right Column: Enrolled Items & Orders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Enrolled Courses */}
                <div className="admin-modal-section" style={{ margin: 0 }}>
                  <h3 className="admin-modal-section-title" style={{ fontSize: '0.78rem', marginBottom: '8px' }}>
                    Enrolled Notes & Masterclasses ({selectedUser.enrolledCourses?.length || 0})
                  </h3>
                  {(!selectedUser.enrolledCourses || selectedUser.enrolledCourses.length === 0) ? (
                    <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-sub)', margin: 0 }}>No study materials enrolled yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {selectedUser.enrolledCourses.map((c, i) => (
                        <div key={i} className="admin-item-row" style={{ padding: '8px 12px', borderRadius: '10px' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{c.title}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--admin-text-sub)' }}>
                              {c.category} • Enrolled: {c.enrolledDate}
                            </div>
                          </div>
                          <span className="badge badge-published" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>Active Access</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Order History */}
                <div className="admin-modal-section" style={{ margin: 0 }}>
                  <h3 className="admin-modal-section-title" style={{ fontSize: '0.78rem', marginBottom: '8px' }}>
                    Purchase History & Receipts ({selectedUser.orderHistory?.length || 0})
                  </h3>
                  {(!selectedUser.orderHistory || selectedUser.orderHistory.length === 0) ? (
                    <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-sub)', margin: 0 }}>No past purchase transactions.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {selectedUser.orderHistory.map((o, i) => (
                        <div key={i} className="admin-item-row" style={{ padding: '8px 12px', borderRadius: '10px' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{o.id} • {o.amount}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--admin-text-sub)' }}>
                              {o.items} • {o.date}
                            </div>
                          </div>
                          <span className="badge badge-orders" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>{o.status || 'PAID'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--admin-border)', paddingTop: '14px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-sub)' }}>
                Targeting Status: <strong style={{ color: '#10b981' }}>100% Outreach Ready</strong>
              </span>
              <button 
                onClick={() => setSelectedUser(null)} 
                className="admin-btn admin-btn-primary"
                style={{ padding: '6px 20px', fontSize: '0.82rem' }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
