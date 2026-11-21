"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WordPressEditor from '@/components/WordPressEditor';

export default function NewBlogPage() {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showPreviewModal) {
        setShowPreviewModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPreviewModal]);

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
        router.push('/blogs');
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
        <div>
          <h1 className="admin-header-title">Write New Legal Blog Article</h1>
          <p className="admin-header-subtitle">
            Create authoritative statutory analysis, case law briefs, and judicial masterclasses.
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
            ← Cancel
          </Link>
          <button 
            type="button" 
            onClick={handleSubmit} 
            className="admin-btn admin-btn-primary" 
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Save & Publish'}
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
                Step 1: Set Title & Details
              </span>
            </div>

            {/* Title */}
            <div className="admin-form-group">
              <label className="admin-label">Blog Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="e.g. Overview of Negotiable Instruments Act, 1881: Legal Analysis & Supreme Court Jurisprudence"
                className="admin-input"
                style={{ fontSize: '1.05rem', fontWeight: 600 }}
                required
              />
            </div>

            {/* 4-Column Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '18px' }}>
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
                    title={`Badge Color: ${form.categoryColor} (Click to customize)`}
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
                        backgroundColor: form.categoryColor,
                        border: '1px solid rgba(0,0,0,0.15)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }} 
                    />
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
                <label className="admin-label">Estimated Read Time</label>
                <input
                  type="text"
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  placeholder="e.g. 6 min read"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Initial Views
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)', fontWeight: 400, marginLeft: '6px' }}>
                    (Optional baseline)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.views || 0}
                  onChange={(e) => setForm({ ...form, views: parseInt(e.target.value, 10) || 0 })}
                  placeholder="0"
                  className="admin-input"
                  title="Initial views count. Automatically increments as readers view the article."
                />
              </div>
            </div>

            {/* Short Excerpt */}
            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label className="admin-label">Short Excerpt / Summary</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="A quick 1-2 sentence overview of statutory provisions and courtroom ratio discussed in this article..."
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
                  Use <strong>Split View</strong> to write on the left while observing the real-time student layout on the right.
                </span>
              </div>
            </div>

            <WordPressEditor
              value={form.content}
              onChange={(html) => setForm(prev => ({ ...prev, content: html }))}
            />

            {/* Bottom Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--admin-border)', flexWrap: 'wrap', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.92rem' }}>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#cfa856', cursor: 'pointer' }}
                />
                <span>Publish Immediately on teachmelegal.com</span>
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
                  disabled={loading} 
                  style={{ padding: '12px 34px' }}
                >
                  {loading ? 'Publishing...' : 'Save & Publish Post'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Full-Screen Student Reader Preview */}
      {showPreviewModal && (
        <div 
          className="admin-fullscreen-preview-overlay"
          onClick={() => setShowPreviewModal(false)}
        >
          {/* Top Sticky Bar */}
          <header 
            className="admin-fullscreen-preview-header"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span className="badge badge-exam" style={{ background: `${form.categoryColor || '#cfa856'}20`, color: form.categoryColor || '#cfa856', fontWeight: 800 }}>
                {form.category}
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--admin-text-sub)', fontWeight: 600 }}>
                Full-Screen Simulated Reader Preview • {form.readTime || '5 min read'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-sub)', background: 'var(--admin-body-bg)', padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--admin-border)' }}>
                Press <kbd style={{ fontWeight: 800 }}>ESC</kbd> to exit
              </span>
              <button 
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="admin-btn admin-btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.86rem', fontWeight: 700 }}
              >
                ← Back to Editing Canvas
              </button>
            </div>
          </header>

          {/* Expansive Reading Container */}
          <div 
            className="admin-fullscreen-preview-container"
            onClick={(e) => e.stopPropagation()}
          >
            <article className="post-content">
              <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.25, margin: '0 0 16px', color: 'var(--admin-text-main)', letterSpacing: '-0.02em' }}>
                {form.title || 'Untitled Legal Article'}
              </h1>
              
              <div style={{ display: 'flex', gap: '20px', color: 'var(--admin-text-sub)', fontSize: '0.92rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '18px', marginBottom: '26px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--admin-text-main)' }}>By {form.author || 'Adv. Prashant Jha'}</span>
                <span>•</span>
                <span>Category: <strong style={{ color: form.categoryColor || 'var(--admin-gold)' }}>{form.category}</strong></span>
                <span>•</span>
                <span>Read Time: {form.readTime || '5 min read'}</span>
                <span>•</span>
                <span>Status: Draft / Pre-Publish</span>
              </div>

              {form.excerpt && (
                <div style={{ background: 'rgba(207, 168, 86, 0.08)', borderLeft: '4px solid var(--admin-gold)', padding: '16px 24px', borderRadius: '0 12px 12px 0', marginBottom: '32px', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  {form.excerpt}
                </div>
              )}

              <div 
                className="article-full-body"
                dangerouslySetInnerHTML={{ __html: form.content || '<p style="color: #94a3b8; font-style: italic;">No content written yet.</p>' }} 
              />
            </article>
          </div>
        </div>
      )}
    </>
  );
}
