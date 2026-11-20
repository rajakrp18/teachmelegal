"use client";
import { useEffect, useState } from 'react';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [trafficSources, setTrafficSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch('http://localhost:5000/api/admin/analytics');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setPopularBlogs(data.popularBlogs || []);
          setTrafficSources(data.trafficSources || []);
        }
      } catch (err) {
        console.error('Failed to load analytics stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  return (
    <>
      <header className="admin-header">
        <h1 className="admin-header-title">Analytics & Visitor Insights</h1>
      </header>

      <main className="admin-content">
        {/* Top Summary Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">{stats?.totalViews || 0}</div>
              <div className="admin-stat-label">Total Monthly Page Views</div>
            </div>
            <div className="admin-stat-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>📈</div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">3m 42s</div>
              <div className="admin-stat-label">Avg. Session Duration</div>
            </div>
            <div className="admin-stat-icon" style={{ background: '#f0fdf4', color: '#10b981' }}>⏱️</div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">68.4%</div>
              <div className="admin-stat-label">Returning Readers</div>
            </div>
            <div className="admin-stat-icon" style={{ background: '#faf5ff', color: '#a855f7' }}>🔄</div>
          </div>

          <div className="admin-stat-card">
            <div>
              <div className="admin-stat-val">94.2%</div>
              <div className="admin-stat-label">Organic Search Traffic</div>
            </div>
            <div className="admin-stat-icon" style={{ background: '#fffbebf', color: '#f59e0b' }}>🔍</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
          {/* Top Read Legal Articles */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">🔥 Most Read Legal Articles</h2>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Article Title</th>
                    <th>Category</th>
                    <th>Total Views</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                  ) : popularBlogs.length === 0 ? (
                    <tr><td colSpan="3" style={{ padding: '20px', textAlign: 'center' }}>No articles found.</td></tr>
                  ) : (
                    popularBlogs.map((post) => (
                      <tr key={post.id}>
                        <td style={{ fontWeight: 600 }}>{post.title}</td>
                        <td>
                          <span className="badge" style={{ background: `var(--admin-primary)`, color: 'var(--admin-gold)' }}>
                            {post.category}
                          </span>
                        </td>
                        <td><strong>{post.views} views</strong></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Traffic Breakdown Cards */}
          <div className="admin-card" style={{ padding: '24px' }}>
            <h2 className="admin-card-title" style={{ marginBottom: '20px' }}>🌐 Traffic Sources</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
              ) : trafficSources.map((item, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
                    <span>{item.name}</span>
                    <span style={{ color: item.color }}>{item.percentage}%</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.percentage}%`, background: item.color, borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
