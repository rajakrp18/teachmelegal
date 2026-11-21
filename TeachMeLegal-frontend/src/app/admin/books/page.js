"use client";
import { useEffect, useState } from 'react';
import { IconSearch, IconBookOpen, IconCalendar } from '@/components/Icons';

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Exam Materials',
    originalPrice: '₹299',
    salePrice: '₹99',
    numericPrice: 99,
    badge: 'Sale!',
    badgeColor: '#22c55e',
    coverColor: '#1e3a5f',
    icon: '📘',
    driveUrl: '',
    image: '',
    author: 'Adv. Prashant Jha',
    date: 'Nov 2026',
    active: true
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = type === 'pdf';
    if (isPdf) setUploadingPdf(true);
    else setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', isPdf ? 'books/documents' : 'books/covers');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (isPdf) {
          setForm(prev => ({ ...prev, driveUrl: data.url }));
        } else {
          setForm(prev => ({ ...prev, image: data.url }));
        }
      } else {
        alert(data.error || 'Failed to upload file.');
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('An error occurred during file upload.');
    } finally {
      if (isPdf) setUploadingPdf(false);
      else setUploadingImage(false);
      e.target.value = '';
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/books');
      const data = await res.json();
      if (data.success) {
        setBooks(data.books || []);
      }
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openAddModal = () => {
    setEditingBook(null);
    setForm({
      title: '',
      category: 'Exam Materials',
      originalPrice: '₹299',
      salePrice: '₹99',
      numericPrice: 99,
      badge: 'Sale!',
      badgeColor: '#22c55e',
      coverColor: '#1e3a5f',
      icon: '📘',
      driveUrl: '',
      image: '',
      author: 'Adv. Prashant Jha',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      active: true
    });
    setShowModal(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setForm({
      ...book,
      image: book.image || '',
      author: book.author || 'Adv. Prashant Jha',
      driveUrl: book.driveUrl || '',
      date: book.date || 'Nov 2026'
    });
    setShowModal(true);
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete book/notes "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/books/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBooks(books.filter(b => b.id !== id));
      } else {
        alert(data.error || 'Failed to delete book');
      }
    } catch (err) {
      alert('Error deleting book');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingBook ? `/api/admin/books/${editingBook.id}` : '/api/admin/books';
      const method = editingBook ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchBooks();
      } else {
        alert(data.error || 'Failed to save book');
      }
    } catch (err) {
      alert('Error saving book');
    }
  };

  const parseItemDate = (dateStr) => {
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

  const filteredBooks = books.filter(b => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      b.title.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      (b.badge && b.badge.toLowerCase().includes(q)) ||
      (b.author && b.author.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'ALL' || b.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'Active' ? b.active : !b.active);

    let matchesDate = true;
    const itemDate = parseItemDate(b.date);
    if (itemDate) {
      if (startDate) {
        const start = new Date(`${startDate}T00:00:00`);
        if (itemDate < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(`${endDate}T23:59:59`);
        if (itemDate > end) matchesDate = false;
      }
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  const hasActiveFilters = Boolean(search || categoryFilter !== 'ALL' || statusFilter !== 'ALL' || startDate || endDate);

  const handleResetFilters = () => {
    setSearch('');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setStartDate('');
    setEndDate('');
  };

  return (
    <>
      <header className="admin-header">
        <div>
          <h1 className="admin-header-title">Books, Notes & Revision Material Management</h1>
          <p className="admin-header-subtitle">
            Curate bare act revision notes, question banks, and statutory subject charts.
          </p>
        </div>
        <div className="admin-header-actions">
          <button onClick={openAddModal} className="admin-btn admin-btn-primary">
            Add New Book / Notes
          </button>
        </div>
      </header>

      <main className="admin-content">
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-filter-bar">
              <div className="admin-search-wrapper">
                <span className="search-icon"><IconSearch size={16} /></span>
                <input
                  type="text"
                  placeholder="Search notes & books..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="admin-search-input"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="admin-select"
              >
                <option value="ALL">All Categories</option>
                <option value="Exam Materials">Exam Materials</option>
                <option value="Question Bank">Question Bank</option>
                <option value="Revision Chart">Revision Chart</option>
                <option value="Subject wise Notes">Subject wise Notes</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="admin-select"
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active Only</option>
                <option value="Hidden">Hidden Only</option>
              </select>

              {/* Date Filter: From Date to That Date */}
              <div className="admin-date-picker-wrap">
                <label>From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="admin-date-input"
                  title="Filter books published on or after this date"
                />
              </div>

              <div className="admin-date-picker-wrap">
                <label>To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="admin-date-input"
                  title="Filter books published on or before this date"
                />
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

            <span style={{ fontSize: '0.84rem', color: 'var(--admin-text-sub)' }}>
              Showing {filteredBooks.length} of {books.length} publications
            </span>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '55px', textAlign: 'center' }}>SL No.</th>
                  <th style={{ minWidth: '180px' }}>Book / Notes Title</th>
                  <th style={{ minWidth: '120px' }}>Category</th>
                  <th style={{ minWidth: '100px' }}>Published Date</th>
                  <th style={{ minWidth: '85px' }}>Original</th>
                  <th style={{ minWidth: '85px' }}>Sale Price</th>
                  <th style={{ minWidth: '80px' }}>Badge</th>
                  <th style={{ minWidth: '85px' }}>Status</th>
                  <th style={{ minWidth: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '36px' }}>
                      <div className="admin-loading-spinner" style={{ margin: '0 auto 10px' }} />
                      Loading books & study notes...
                    </td>
                  </tr>
                ) : filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--admin-text-sub)' }}>
                      No legal materials found matching current search and filters.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book, idx) => (
                    <tr key={book.id}>
                      <td style={{ fontWeight: 800, color: 'var(--admin-gold)', textAlign: 'center' }}>
                        #{idx + 1}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--admin-text-main)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.05rem', flexShrink: 0 }}>{book.icon || '📘'}</span>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span>{book.title}</span>
                              {book.driveUrl && (
                                <a 
                                  href={book.driveUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="badge" 
                                  style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', border: '1px solid rgba(59, 130, 246, 0.25)', textDecoration: 'none', fontSize: '0.68rem', padding: '1px 6px' }}
                                  title="Open Direct Google Drive / PDF Link"
                                >
                                  Drive Link ↗
                                </a>
                              )}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--admin-text-sub)', fontWeight: 400 }}>
                              ID: {book.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: 'var(--admin-body-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-main)', fontSize: '0.74rem' }}>
                          {book.category}
                        </span>
                      </td>
                      <td style={{ color: 'var(--admin-text-sub)', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                        {book.date || 'Nov 2026'}
                      </td>
                      <td style={{ textDecoration: 'line-through', color: 'var(--admin-text-sub)', fontSize: '0.82rem' }}>{book.originalPrice}</td>
                      <td><strong style={{ color: '#047857', fontSize: '0.84rem' }}>{book.salePrice}</strong></td>
                      <td>
                        <span className="badge" style={{ background: `${book.badgeColor || '#cfa856'}20`, color: book.badgeColor || 'var(--admin-gold)', fontSize: '0.74rem' }}>
                          {book.badge}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${book.active ? 'badge-published' : 'badge-draft'}`} style={{ fontSize: '0.74rem' }}>
                          {book.active ? '● Active' : '○ Hidden'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button onClick={() => openEditModal(book)} className="admin-btn admin-btn-primary" style={{ padding: '5px 10px', fontSize: '0.76rem' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(book.id, book.title)} className="admin-btn admin-btn-danger" style={{ padding: '5px 10px', fontSize: '0.76rem' }}>
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

        {/* Modal Dialog for Add / Edit (Compact 2-Column Layout - ZERO SCROLL) */}
        {showModal && (
          <div 
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: 'rgba(0,0,0,0.55)', 
              backdropFilter: 'blur(3px)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 1000, 
              padding: '16px' 
            }}
            onClick={() => setShowModal(false)}
          >
            <div 
              className="admin-card" 
              style={{ 
                width: '100%', 
                maxWidth: '780px', 
                padding: '22px 28px', 
                margin: 0, 
                maxHeight: '92vh',
                borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '10px' }}>
                <h2 className="admin-card-title" style={{ margin: 0, fontSize: '1.2rem' }}>
                  {editingBook ? 'Edit Book / Notes Details' : 'Add New Book / Notes'}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--admin-text-sub)', padding: '0 4px', lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
                  {/* Left Column */}
                  <div>
                    <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                      <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Title *</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. Code of Civil Procedure Quick Revision Notes"
                        className="admin-input"
                        style={{ padding: '7px 11px', fontSize: '0.85rem', borderRadius: '8px' }}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Category</label>
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="admin-select"
                          style={{ width: '100%', padding: '7px 11px', fontSize: '0.85rem', borderRadius: '8px' }}
                        >
                          <option value="Exam Materials">Exam Materials</option>
                          <option value="Question Bank">Question Bank</option>
                          <option value="Revision Chart">Revision Chart</option>
                          <option value="Subject wise Notes">Subject wise Notes</option>
                        </select>
                      </div>

                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Published Date</label>
                        <input
                          type="text"
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          placeholder="e.g. Nov 2026"
                          className="admin-input"
                          style={{ padding: '7px 11px', fontSize: '0.85rem', borderRadius: '8px' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Original Price (₹299)</label>
                        <input
                          type="text"
                          value={form.originalPrice}
                          onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                          className="admin-input"
                          style={{ padding: '7px 11px', fontSize: '0.85rem', borderRadius: '8px' }}
                        />
                      </div>

                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Sale Price (₹99)</label>
                        <input
                          type="text"
                          value={form.salePrice}
                          onChange={(e) => setForm({ ...form, salePrice: e.target.value, numericPrice: parseFloat(e.target.value.replace(/[^0-9.]/g, '') || 99) })}
                          className="admin-input"
                          style={{ padding: '7px 11px', fontSize: '0.85rem', borderRadius: '8px' }}
                          required
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <label className="admin-label" style={{ fontSize: '0.74rem', margin: 0 }}>
                          Book PDF / Drive Link
                        </label>
                        <label 
                          style={{ 
                            fontSize: '0.72rem', 
                            color: 'var(--admin-gold)', 
                            fontWeight: 700, 
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(207, 168, 86, 0.1)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(207, 168, 86, 0.3)'
                          }}
                        >
                          {uploadingPdf ? '⏳ Uploading...' : '📄 Upload PDF'}
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            style={{ display: 'none' }}
                            disabled={uploadingPdf}
                            onChange={(e) => handleFileUpload(e, 'pdf')}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={form.driveUrl || ''}
                        onChange={(e) => setForm({ ...form, driveUrl: e.target.value })}
                        placeholder="https://drive.google.com/file/d/... or uploaded PDF"
                        className="admin-input"
                        style={{ padding: '7px 11px', fontSize: '0.83rem', borderRadius: '8px' }}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-sub)', marginTop: '2px', display: 'block' }}>
                        {form.driveUrl ? (
                          <span style={{ color: 'var(--admin-gold)', fontWeight: 600 }}>
                            ✓ File attached: {form.driveUrl.startsWith('/') ? form.driveUrl.split('/').pop() : 'External link configured'}
                          </span>
                        ) : (
                          'Upload a PDF directly or paste a Google Drive link.'
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Icon Emoji</label>
                        <input
                          type="text"
                          value={form.icon}
                          onChange={(e) => setForm({ ...form, icon: e.target.value })}
                          placeholder="📘"
                          className="admin-input"
                          style={{ padding: '7px 11px', fontSize: '0.85rem', borderRadius: '8px' }}
                        />
                      </div>

                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Badge (e.g. Sale!)</label>
                        <input
                          type="text"
                          value={form.badge}
                          onChange={(e) => setForm({ ...form, badge: e.target.value })}
                          className="admin-input"
                          style={{ padding: '7px 11px', fontSize: '0.85rem', borderRadius: '8px' }}
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                      <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Author Name</label>
                      <input
                        type="text"
                        value={form.author || 'Adv. Prashant Jha'}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                        className="admin-input"
                        style={{ padding: '7px 11px', fontSize: '0.85rem', borderRadius: '8px' }}
                      />
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <label className="admin-label" style={{ fontSize: '0.74rem', margin: 0 }}>Cover Image</label>
                        <label 
                          style={{ 
                            fontSize: '0.72rem', 
                            color: 'var(--admin-gold)', 
                            fontWeight: 700, 
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(207, 168, 86, 0.1)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(207, 168, 86, 0.3)'
                          }}
                        >
                          {uploadingImage ? '⏳ Uploading...' : '📁 Upload Image'}
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }}
                            disabled={uploadingImage}
                            onChange={(e) => handleFileUpload(e, 'image')}
                          />
                        </label>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={form.image || ''}
                          onChange={(e) => setForm({ ...form, image: e.target.value })}
                          placeholder="/books/cover.png or https://..."
                          className="admin-input"
                          style={{ padding: '7px 11px', fontSize: '0.85rem', borderRadius: '8px', flex: 1 }}
                        />
                        {form.image && (
                          <div style={{ width: '32px', height: '32px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--admin-border)', flexShrink: 0, background: '#f1f5f9' }}>
                            <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--admin-text-sub)', marginTop: '2px', display: 'block' }}>
                        Upload a local cover image (PNG, JPG, WebP) or paste an image URL.
                      </span>
                    </div>

                    <div className="admin-form-group" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={form.active}
                          onChange={(e) => setForm({ ...form, active: e.target.checked })}
                          style={{ accentColor: 'var(--admin-gold)', width: '16px', height: '16px' }}
                        />
                        Active & Published on Website
                      </label>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px', borderTop: '1px solid var(--admin-border)', paddingTop: '12px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="admin-btn admin-btn-secondary" style={{ padding: '6px 16px', fontSize: '0.82rem' }}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '6px 18px', fontSize: '0.82rem' }}>
                    {editingBook ? 'Save Changes' : 'Add Book / Notes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
