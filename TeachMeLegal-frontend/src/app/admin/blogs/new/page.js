"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WordPressEditor from '@/components/WordPressEditor';

export default function NewBlogPage() {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(prev => ({
      ...prev,
      title,
      slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ? generatedSlug : prev.slug
    }));
  };

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
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and Blog Content are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/blogs');
      } else {
        setError(data.error || 'Failed to save blog post.');
      }
    } catch (err) {
      setError('An error occurred while publishing the post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1 className="admin-header-title">Write New Legal Blog Article</h1>
        <div className="admin-header-actions">
          <Link href="/admin/blogs" className="admin-btn admin-btn-secondary">
            ← Cancel
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
                onChange={handleTitleChange}
                placeholder="e.g. Overview of Negotiable Instruments Act, 1881"
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
                  placeholder="overview-of-negotiable-instruments-act"
                  className="admin-input"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Category</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-sub)', textTransform: 'none', fontWeight: 500 }}>
                    Badge Color: <strong style={{ color: form.categoryColor }}>{form.categoryColor}</strong>
                  </span>
                </label>
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

                  {/* Elegant Modern Color Card */}
                  <label 
                    className="admin-color-card"
                    title="Click to customize category badge color"
                  >
                    <span 
                      className="admin-color-swatch-dot" 
                      style={{ backgroundColor: form.categoryColor }} 
                    />
                    <span className="admin-color-hex">
                      {form.categoryColor.toUpperCase()}
                    </span>
                    <input
                      type="color"
                      value={form.categoryColor}
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

                {/* Quick Palette Swatches */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-sub)', fontWeight: 600 }}>Palette:</span>
                  {[
                    { name: 'Luxury Gold', color: '#cfa856' },
                    { name: 'Supreme Blue', color: '#3b82f6' },
                    { name: 'Criminal Red', color: '#ef4444' },
                    { name: 'Corporate Emerald', color: '#10b981' },
                    { name: 'Judicial Purple', color: '#8b5cf6' },
                    { name: 'Slate Gray', color: '#64748b' }
                  ].map((swatch) => (
                    <button
                      key={swatch.color}
                      type="button"
                      onClick={() => setForm({ ...form, categoryColor: swatch.color })}
                      title={`${swatch.name} (${swatch.color})`}
                      style={{
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        backgroundColor: swatch.color,
                        border: form.categoryColor.toLowerCase() === swatch.color.toLowerCase() ? '2px solid var(--admin-text-main)' : '1px solid rgba(0,0,0,0.2)',
                        transform: form.categoryColor.toLowerCase() === swatch.color.toLowerCase() ? 'scale(1.25)' : 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.15s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
                <label className="admin-label">Estimated Read Time</label>
                <input
                  type="text"
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  placeholder="e.g. 6 min read"
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Short Excerpt / Summary</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="A quick 1-2 sentence overview of what this article covers..."
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
                <span>Publish Immediately</span>
              </label>

              <button type="submit" className="admin-btn admin-btn-primary" disabled={loading} style={{ padding: '12px 30px' }}>
                {loading ? 'Publishing...' : '🚀 Save & Publish Post'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
