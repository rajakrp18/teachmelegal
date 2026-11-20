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
    categoryColor: '#cfa856',
    author: 'Advocate Prashant Jha',
    readTime: '5 min read',
    excerpt: '',
    content: '',
    published: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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
        router.push('/blogs');
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
        <div className="admin-loading-spinner" style={{ margin: '0 auto 16px' }} />
        Loading article data...
      </main>
    );
  }

  return (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-header-title">Edit Article: {form.title}</h1>
          <p className="admin-header-subtitle">
            Update statutory citations, sections, case laws, and courtroom ratio.
          </p>
        </div>
        <div className="admin-header-actions">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="admin-btn admin-btn-secondary"
            title="Preview how this article looks to students on TeachMeLegal"
          >
            Live Student Preview
          </button>
          <Link href="/blogs" className="admin-btn admin-btn-secondary">
            ← Back to Blogs
          </Link>
          <button 
            type="button" 
            onClick={handleSubmit} 
            className="admin-btn admin-btn-primary" 
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* Main Full-Width Content Canvas */}
      <main className="admin-content" style={{ width: '100%', maxWidth: '100%' }}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '14px 20px', borderRadius: '12px', marginBottom: '8px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Metadata Card */}
          <div className="admin-card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '14px' }}>
              <h2 className="admin-card-title" style={{ fontSize: '1.15rem' }}>
                Article Metadata & Classification
              </h2>
              <span style={{ fontSize: '0.82rem', color: 'var(--admin-gold)', fontWeight: 700 }}>
                Editing Post ID: {id}
              </span>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Blog Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="admin-input"
                style={{ fontSize: '1.05rem', fontWeight: 600 }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px' }}>
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
                      background: 'var(--admin-body-bg)',
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
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)', fontWeight: 400, marginLeft: '6px' }}>
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

            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label className="admin-label">Short Excerpt / Summary</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="admin-textarea"
                style={{ minHeight: '68px' }}
              />
            </div>
          </div>

          {/* Full Canvas Editor Card */}
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 className="admin-card-title" style={{ fontSize: '1.15rem' }}>
                  Article Content Canvas
                </h2>
                <span style={{ fontSize: '0.84rem', color: 'var(--admin-text-sub)' }}>
                  Use <strong>Split View</strong> to edit on the left while observing the real-time student layout on the right.
                </span>
              </div>
            </div>

            <WordPressEditor
              value={form.content}
              onChange={(html) => setForm(prev => ({ ...prev, content: html }))}
            />

            {/* Bottom Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--admin-border)', flexWrap: 'wrap', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.92rem' }}>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#cfa856', cursor: 'pointer' }}
                />
                <span>Published on teachmelegal.com</span>
              </label>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="admin-btn admin-btn-secondary"
                >
                  Live Student Preview
                </button>
                <button 
                  type="submit" 
                  className="admin-btn admin-btn-primary" 
                  disabled={saving} 
                  style={{ padding: '12px 34px' }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Full Student Preview Modal */}
      {showPreviewModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowPreviewModal(false)}>
          <div 
            className="admin-modal-card" 
            style={{ maxWidth: '960px', width: '95%', maxHeight: '92vh', padding: '36px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <span className="badge badge-exam" style={{ background: `${form.categoryColor || '#cfa856'}20`, color: form.categoryColor || '#cfa856' }}>
                  {form.category}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-sub)', marginLeft: '12px' }}>
                  Simulated Student Reading Mode • {form.readTime}
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="admin-modal-close"
              >
                ✕
              </button>
            </div>

            <article className="post-content">
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.25, margin: '0 0 16px', color: 'var(--admin-text-main)' }}>
                {form.title || 'Untitled Legal Article'}
              </h1>
              
              <div style={{ display: 'flex', gap: '18px', color: 'var(--admin-text-sub)', fontSize: '0.88rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '16px', marginBottom: '24px' }}>
                <span>{form.author || 'Adv. Prashant Jha'}</span>
                <span>Published</span>
                <span>{form.readTime}</span>
              </div>

              {form.excerpt && (
                <div style={{ background: 'rgba(207, 168, 86, 0.08)', borderLeft: '3.5px solid var(--admin-gold)', padding: '14px 20px', borderRadius: '0 10px 10px 0', marginBottom: '28px', fontStyle: 'italic', fontSize: '1.02rem' }}>
                  {form.excerpt}
                </div>
              )}

              <div dangerouslySetInnerHTML={{ __html: form.content || '<p style="color: #94a3b8; font-style: italic;">No content.</p>' }} />
            </article>

            <div style={{ marginTop: '28px', textAlign: 'right', borderTop: '1px solid var(--admin-border)', paddingTop: '16px' }}>
              <button 
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="admin-btn admin-btn-primary"
              >
                ← Back to Editing Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
