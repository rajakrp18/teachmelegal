"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (data.success) {
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error('Failed to load users:', err);
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
      (u.phone && u.phone.includes(q))
    );
  });

  const totalEnrollments = users.reduce((acc, u) => acc + (u.enrolledCourses?.length || 0), 0);
  const totalOrders = users.reduce((acc, u) => acc + (u.orderHistory?.length || 0), 0);

  return (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-header-title">Enrolled Scholars & User Accounts</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
            Inspect student profiles, target judicial exams, enrolled study notes, and transaction histories.
          </p>
        </div>
        <div className="admin-header-actions">
          <input
            type="text"
            placeholder="Search scholars by name, email, or exam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              width: '320px'
            }}
          />
        </div>
      </header>

      <main className="admin-content">
        {/* Quick Stats Grid */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{users.length}</div>
              <div className="admin-stat-label">Registered Scholars</div>
            </div>
            <div className="admin-stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>👥</div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{totalEnrollments}</div>
              <div className="admin-stat-label">Active Course Enrollments</div>
            </div>
            <div className="admin-stat-icon" style={{ background: '#f0fdf4', color: '#10b981' }}>🎓</div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{totalOrders}</div>
              <div className="admin-stat-label">Completed Orders</div>
            </div>
            <div className="admin-stat-icon" style={{ background: '#fefce8', color: '#eab308' }}>📑</div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">100%</div>
              <div className="admin-stat-label">Security Encryption (PBKDF2)</div>
            </div>
            <div className="admin-stat-icon" style={{ background: '#faf5ff', color: '#a855f7' }}>🛡️</div>
          </div>
        </div>

        {/* Scholars Table Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Registered Scholars List ({filteredUsers.length})</h2>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Scholar</th>
                  <th>Contact Info</th>
                  <th>Target Exam / Status</th>
                  <th>University / State</th>
                  <th>Courses</th>
                  <th>Orders</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>Loading scholar records...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>No scholars found matching your search.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#0d2137',
                            color: '#cfa856',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {(u.name || u.email || 'S').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>ID: {u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{u.email}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{u.phone || 'No phone provided'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{u.targetExam || 'Judiciary Aspirant'}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{u.profession || 'Law Student'}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.88rem' }}>{u.university || 'Not specified'}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{u.state || 'India'}</div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: '#f0fdf4', color: '#15803d', fontWeight: 700 }}>
                          {u.enrolledCourses?.length || 0} enrolled
                        </span>
                      </td>
                      <td>
                        <span className="badge" style={{ background: '#fefce8', color: '#a16207', fontWeight: 700 }}>
                          {u.orderHistory?.length || 0} orders
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                        >
                          View Details 👁️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Scholar Detail Modal */}
      {selectedUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{selectedUser.name}</h2>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{selectedUser.email} • Member since {selectedUser.memberSince}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '8px', textTransform: 'uppercase' }}>Academic & Exam Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '10px', fontSize: '0.88rem' }}>
                <div><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</div>
                <div><strong>Target Exam:</strong> {selectedUser.targetExam || 'N/A'}</div>
                <div><strong>Profession:</strong> {selectedUser.profession || 'N/A'}</div>
                <div><strong>Year of Study:</strong> {selectedUser.yearOfStudy || 'N/A'}</div>
                <div><strong>University:</strong> {selectedUser.university || 'N/A'}</div>
                <div><strong>State:</strong> {selectedUser.state || 'N/A'}</div>
              </div>
              {selectedUser.bio && (
                <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#475569', background: '#f1f5f9', padding: '10px 14px', borderRadius: '8px' }}>
                  <strong>Bio:</strong> {selectedUser.bio}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '8px', textTransform: 'uppercase' }}>
                Enrolled Materials ({selectedUser.enrolledCourses?.length || 0})
              </h3>
              {(!selectedUser.enrolledCourses || selectedUser.enrolledCourses.length === 0) ? (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No courses or notes currently enrolled.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedUser.enrolledCourses.map((c, i) => (
                    <div key={i} style={{ border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{c.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.category} • Enrolled: {c.enrolledDate}</div>
                      </div>
                      <span className="badge" style={{ background: '#f0fdf4', color: '#15803d' }}>Active</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '8px', textTransform: 'uppercase' }}>
                Order History ({selectedUser.orderHistory?.length || 0})
              </h3>
              {(!selectedUser.orderHistory || selectedUser.orderHistory.length === 0) ? (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No past purchase transactions found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedUser.orderHistory.map((o, i) => (
                    <div key={i} style={{ border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{o.id} • {o.amount}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{o.items} • {o.date}</div>
                      </div>
                      <span className="badge badge-published">{o.status || 'PAID'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedUser(null)}
                className="admin-btn admin-btn-primary"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
