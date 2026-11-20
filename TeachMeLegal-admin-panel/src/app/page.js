"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IconEye,
  IconBlog,
  IconUsers,
  IconCheckCircle,
  IconSearch,
  IconArrowUpRight,
  IconSparkles
} from '../components/Icons';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [usersCount, setUsersCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = blogs.filter(post => 
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    async function loadData() {
      try {
        const [analyticsRes, blogsRes, usersRes] = await Promise.all([
          fetch('/api/admin/analytics').catch(() => null),
          fetch('/api/admin/blogs').catch(() => null),
          fetch('/api/admin/users').catch(() => null)
        ]);

        if (analyticsRes && analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          if (analyticsData.success) setStats(analyticsData.stats);
        }
        if (blogsRes && blogsRes.ok) {
          const blogsData = await blogsRes.json();
          if (blogsData.success) setBlogs(blogsData.posts || []);
        }
        if (usersRes && usersRes.ok) {
          const usersData = await usersRes.json();
          if (usersData.success && Array.isArray(usersData.users)) {
            setUsersCount(usersData.users.length);
          }
        }
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
        <div>
          <h1 className="admin-header-title">Dashboard Overview</h1>
          <p className="admin-header-subtitle">
            Platform performance metrics, judicial publication pipeline, and active legal scholars.
          </p>
        </div>
        <div className="admin-header-actions">
          <Link href="/blogs/new" className="admin-btn admin-btn-primary">
            <span>+ Write New Blog</span>
          </Link>
          <Link href="/users" className="admin-btn admin-btn-secondary">
            <span>Inspect Scholars</span>
          </Link>
        </div>
      </header>

      <main className="admin-content">
        {/* Quick Stats Grid */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{stats?.totalViews || 1420}</div>
              <div className="admin-stat-label">Total Legal Article Views</div>
              <div className="admin-stat-trend">↑ 18% this month</div>
            </div>
            <div className="admin-stat-icon-wrap blue">
              <IconEye size={22} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{blogs.length || 6}</div>
              <div className="admin-stat-label">Published Legal Articles</div>
              <div className="admin-stat-trend">Live on teachmelegal.com</div>
            </div>
            <div className="admin-stat-icon-wrap gold">
              <IconBlog size={22} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{usersCount}</div>
              <div className="admin-stat-label">Enrolled Legal Scholars</div>
              <div className="admin-stat-trend">Targetable Judiciary Aspirants</div>
            </div>
            <div className="admin-stat-icon-wrap green">
              <IconUsers size={22} />
            </div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">99.9%</div>
              <div className="admin-stat-label">Cloud Platform Uptime</div>
              <div className="admin-stat-trend">SSL Encrypted & Razorpay Ready</div>
            </div>
            <div className="admin-stat-icon-wrap purple">
              <IconSparkles size={22} />
            </div>
          </div>
        </div>

        {/* Recent Blogs Table Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Live Editorial & Case Law Articles</h2>
              <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-sub)' }}>
                Published legal articles available on the student frontend.
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="admin-search-wrapper">
                <span className="search-icon"><IconSearch size={15} /></span>
                <input 
                  type="text" 
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-search-input"
                  style={{ width: '220px' }}
                />
              </div>

              <Link href="/blogs" className="admin-btn admin-btn-secondary">
                View All Posts →
              </Link>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sl No.</th>
                  <th>Article Title</th>
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
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                      <div className="admin-loading-spinner" style={{ margin: '0 auto 12px' }} />
                      Loading articles...
                    </td>
                  </tr>
                ) : filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-sub)' }}>
                      No legal blog posts found.
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.slice(0, 8).map((post, idx) => (
                    <tr key={post.id || idx}>
                      <td style={{ fontWeight: 800, color: 'var(--admin-gold)' }}>#{idx + 1}</td>
                      <td style={{ fontWeight: 700, color: 'var(--admin-text-main)', maxWidth: '320px' }}>
                        {post.title}
                      </td>
                      <td>
                        <span className="badge" style={{ 
                          background: 'rgba(207, 168, 86, 0.12)', 
                          color: 'var(--admin-gold)',
                          border: '1px solid rgba(207, 168, 86, 0.25)' 
                        }}>
                          {post.category || 'Banking Law'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{post.author || 'Adv. Prashant Jha'}</td>
                      <td style={{ color: 'var(--admin-text-sub)', whiteSpace: 'nowrap' }}>
                        📅 {post.date || 'Recently'}
                      </td>
                      <td><strong>{post.views || 0}</strong></td>
                      <td>
                        <span className={`badge ${post.published !== false ? 'badge-published' : 'badge-draft'}`}>
                          {post.published !== false ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link 
                            href={`http://localhost:3000/blog/${post.slug || ''}`} 
                            target="_blank" 
                            className="admin-btn admin-btn-secondary" 
                            style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                          >
                            Live ↗
                          </Link>
                          <Link 
                            href={`/blogs/edit/${post.id}`} 
                            className="admin-btn admin-btn-primary" 
                            style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                          >
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
