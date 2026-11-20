"use client";
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WordPressEditor from '@/components/WordPressEditor';

export default function EditBlogPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Banking Law',
    categoryColor: '#3b82f6',
    author: 'Advocate Prashant Jha',
    readTime: '5 min read',
    excerpt: '',
    content: '',
    published: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/admin/blogs/${id}`);
        const data = await res.json();
        if (data.success && data.post) {
          setForm(data.post);
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        setError('Failed to fetch article details.');
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const categoryDefaults = {
      'Banking Law': '#cfa856',
      'Constitutional Law': '#3b82f6',
      'Criminal Law': '#ef4444',
      'Corporate Law': '#10b981',
      'Teachmelegal': '#8b5cf6'
    };
    setForm(prev => ({
      ...prev,
      category,
      categoryColor: categoryDefaults[category] || prev.categoryColor
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/blogs');
      } else {
        setError(data.error || 'Failed to update blog post.');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-content" style={{ textAlign: 'center', padding: '100px 0' }}>
        Loading article data...
      </main>
    );
  }

  return (
    <>
      <header className="admin-header">
        <h1 className="admin-header-title">Edit Article: {form.title}</h1>
        <div className="admin-header-actions">
          <Link href="/admin/blogs" className="admin-btn admin-btn-secondary">
            ← Back to Blogs
          </Link>
        </div>
      </header>

      <main className="admin-content" style={{ maxWidth: '960px' }}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '14px 20px', borderRadius: '10px', marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-card" style={{ padding: '32px' }}>
            <div className="admin-form-group">
              <label className="admin-label">Blog Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="admin-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="admin-form-group">
                <label className="admin-label">URL Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Category</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={form.category}
                    onChange={handleCategoryChange}
                    className="admin-select"
                    style={{ flex: 1, minWidth: 0, borderRadius: '8px' }}
                  >
                    <option value="Banking Law">Banking Law</option>
                    <option value="Constitutional Law">Constitutional Law</option>
                    <option value="Criminal Law">Criminal Law</option>
                    <option value="Corporate Law">Corporate Law</option>
                    <option value="Teachmelegal">Teachmelegal</option>
                  </select>

                  {/* Compact Color Swatch Card */}
                  <label 
                    className="admin-color-card"
                    title={`Badge Color: ${form.categoryColor || '#cfa856'} (Click to customize)`}
                    style={{
                      width: '38px',
                      height: '38px',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-border)',
                      background: 'var(--admin-body-bg, #ffffff)',
                      cursor: 'pointer',
                      position: 'relative',
                      flexShrink: 0
                    }}
                  >
                    <span 
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        backgroundColor: form.categoryColor || '#cfa856',
                        border: '1px solid rgba(0,0,0,0.15)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <input
                      type="color"
                      value={form.categoryColor || '#cfa856'}
                      onChange={(e) => setForm({ ...form, categoryColor: e.target.value })}
                      style={{
                        position: 'absolute',
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        cursor: 'pointer'
                      }}
                      title="Choose custom badge color"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div className="admin-form-group">
                <label className="admin-label">Author Name</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Read Time</label>
                <input
                  type="text"
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Article Views
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400, marginLeft: '6px' }}>
                    (Live reader count)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.views !== undefined ? form.views : 0}
                  onChange={(e) => setForm({ ...form, views: parseInt(e.target.value, 10) || 0 })}
                  className="admin-input"
                  title="Article reader views. Automatically increments when students read the article on the website, or edit manually here."
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Short Excerpt / Summary</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="admin-textarea"
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Article Content (WordPress Style Visual & Code Editor) *</label>
              <WordPressEditor
                value={form.content}
                onChange={(content) => setForm(prev => ({ ...prev, content }))}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#c5a059' }}
                />
                <span>Published</span>
              </label>

              <button type="submit" className="admin-btn admin-btn-primary" disabled={saving} style={{ padding: '12px 30px' }}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
