"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [analyticsRes, blogsRes] = await Promise.all([
          fetch('/api/admin/analytics'),
          fetch('/api/admin/blogs')
        ]);
        const analyticsData = await analyticsRes.json();
        const blogsData = await blogsRes.json();

        if (analyticsData.success) setStats(analyticsData.stats);
        if (blogsData.success) setBlogs(blogsData.posts || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <>
      <header className="admin-header">
        <h1 className="admin-header-title">Dashboard Overview</h1>
        <div className="admin-header-actions">
          <Link href="/admin/blogs/new" className="admin-btn admin-btn-primary">
            ➕ Write New Blog
          </Link>
        </div>
      </header>

      <main className="admin-content">
        {/* Quick Stats Grid */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{stats?.totalViews || 0}</div>
              <div className="admin-stat-label">Total Blog Views</div>
            </div>
            <div className="admin-stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>👁️</div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{stats?.totalBlogs || 0}</div>
              <div className="admin-stat-label">Total Published Blogs</div>
            </div>
            <div className="admin-stat-icon" style={{ background: '#f0fdf4', color: '#10b981' }}>📚</div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">30.2K</div>
              <div className="admin-stat-label">Active Learners</div>
            </div>
            <div className="admin-stat-icon" style={{ background: '#fefce8', color: '#eab308' }}>🎓</div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">99.8%</div>
              <div className="admin-stat-label">Website Uptime</div>
            </div>
            <div className="admin-stat-icon" style={{ background: '#faf5ff', color: '#a855f7' }}>⚡</div>
          </div>
        </div>

        {/* Recent Blogs Table Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Legal Blog Posts</h2>
            <Link href="/admin/blogs" className="admin-btn admin-btn-secondary" style={{ fontSize: '0.82rem' }}>
              View All Posts →
            </Link>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>Loading articles...</td>
                  </tr>
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>No blog posts found.</td>
                  </tr>
                ) : (
                  blogs.slice(0, 5).map((post) => (
                    <tr key={post.id}>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{post.title}</td>
                      <td>
                        <span className="badge" style={{ background: `${post.categoryColor}15`, color: post.categoryColor }}>
                          {post.category}
                        </span>
                      </td>
                      <td>{post.author}</td>
                      <td style={{ color: '#64748b' }}>{post.date}</td>
                      <td><strong>{post.views || 0}</strong></td>
                      <td>
                        <span className={`badge ${post.published ? 'badge-published' : 'badge-draft'}`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link href={`/blog/${post.slug}`} target="_blank" className="admin-btn admin-btn-secondary" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                            Preview
                          </Link>
                          <Link href={`/admin/blogs/edit/${post.id}`} className="admin-btn admin-btn-primary" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
