"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/admin';

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/blogs`);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.posts || []);
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/blogs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.filter(b => b.id !== id));
      } else {
        alert(data.error || 'Failed to delete blog.');
      }
    } catch (err) {
      alert('Error deleting blog post');
    }
  };

  const handleTogglePublish = async (post) => {
    try {
      const res = await fetch(`${API_URL}/blogs/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published })
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.map(b => b.id === post.id ? { ...b, published: !b.published } : b));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredBlogs = blogs.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
                          post.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || post.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <header className="admin-header">
        <h1 className="admin-header-title">Blog Management</h1>
        <div className="admin-header-actions">
          <Link href="/blogs/new" className="admin-btn admin-btn-primary">
            ➕ Write New Blog
          </Link>
        </div>
      </header>

      <main className="admin-content">
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-filter-bar">
              <input
                type="text"
                placeholder="Search blog title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-search-input"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="admin-search-input"
                style={{ width: '160px' }}
              >
                <option value="ALL">All Categories</option>
                <option value="Banking Law">Banking Law</option>
                <option value="Teachmelegal">Teachmelegal</option>
                <option value="Constitutional Law">Constitutional Law</option>
              </select>
            </div>

            <span style={{ fontSize: '0.88rem', color: 'var(--admin-text-sub)' }}>
              Showing {filteredBlogs.length} of {blogs.length} articles
            </span>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Published Date</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading blogs...</td>
                  </tr>
                ) : filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No blog posts match your search.</td>
                  </tr>
                ) : (
                  filteredBlogs.map((post) => (
                    <tr key={post.id}>
                      <td style={{ fontWeight: 600, color: 'var(--admin-primary)', maxWidth: '320px' }}>
                        <div>{post.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-sub)', fontWeight: 400, marginTop: '4px' }}>
                          /{post.slug}
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: `${post.categoryColor}15`, color: post.categoryColor }}>
                          {post.category}
                        </span>
                      </td>
                      <td style={{ color: 'var(--admin-text-sub)' }}>{post.date}</td>
                      <td><strong>{post.views || 0}</strong></td>
                      <td>
                        <button
                          onClick={() => handleTogglePublish(post)}
                          className={`badge ${post.published ? 'badge-published' : 'badge-draft'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                          title="Click to toggle publish status"
                        >
                          {post.published ? '● Published' : '○ Draft'}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <a href={`http://localhost:3000/blog/${post.slug}`} target="_blank" rel="noreferrer" className="admin-btn admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            View
                          </a>
                          <Link href={`/blogs/edit/${post.id}`} className="admin-btn admin-btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            Edit
                          </Link>
                          <button onClick={() => handleDelete(post.id, post.title)} className="admin-btn admin-btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            Delete
                          </button>
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
