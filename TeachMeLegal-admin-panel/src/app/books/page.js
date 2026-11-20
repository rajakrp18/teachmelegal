"use client";
import { useEffect, useState } from 'react';
import { IconSearch, IconBookOpen, IconCalendar } from '../../components/Icons';

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
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
    date: 'Nov 2026',
    active: true
  });

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
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      active: true
    });
    setShowModal(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setForm({
      ...book,
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

  const filteredBooks = books.filter(b => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      b.title.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      (b.badge && b.badge.toLowerCase().includes(q)) ||
      (b.author && b.author.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'ALL' || b.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'Active' ? b.active : !b.active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

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
            </div>

            <span style={{ fontSize: '0.88rem', color: 'var(--admin-text-sub)' }}>
              Showing {filteredBooks.length} of {books.length} publications
            </span>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>SL No.</th>
                  <th>Book / Notes Title</th>
                  <th>Category</th>
                  <th>Published Date</th>
                  <th>Original Price</th>
                  <th>Sale Price</th>
                  <th>Badge</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                      <div className="admin-loading-spinner" style={{ margin: '0 auto 12px' }} />
                      Loading books & study notes...
                    </td>
                  </tr>
                ) : filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-sub)' }}>
                      No legal materials found matching current search and filters.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book, idx) => (
                    <tr key={book.id}>
                      <td style={{ fontWeight: 800, color: 'var(--admin-gold)' }}>
                        #{idx + 1}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--admin-text-main)' }}>
                        <span style={{ marginRight: '8px' }}>{book.icon || '📘'}</span>
                        {book.title}
                      </td>
                      <td>
                        <span className="badge" style={{ background: 'var(--admin-body-bg)', border: '1px solid var(--admin-border)', color: 'var(--admin-text-main)' }}>
                          {book.category}
                        </span>
                      </td>
                      <td style={{ color: 'var(--admin-text-sub)', whiteSpace: 'nowrap' }}>
                        {book.date || 'Nov 2026'}
                      </td>
                      <td style={{ textDecoration: 'line-through', color: 'var(--admin-text-sub)' }}>{book.originalPrice}</td>
                      <td><strong style={{ color: '#047857' }}>{book.salePrice}</strong></td>
                      <td>
                        <span className="badge" style={{ background: `${book.badgeColor || '#cfa856'}20`, color: book.badgeColor || 'var(--admin-gold)' }}>
                          {book.badge}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${book.active ? 'badge-published' : 'badge-draft'}`}>
                          {book.active ? '● Active' : '○ Hidden'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => openEditModal(book)} className="admin-btn admin-btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(book.id, book.title)} className="admin-btn admin-btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
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

        {/* Modal Dialog for Add / Edit */}
        {showModal && (
          <div 
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
            onClick={() => setShowModal(false)}
          >
            <div 
              className="admin-card" 
              style={{ width: '100%', maxWidth: '600px', padding: '32px', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="admin-card-title" style={{ marginBottom: '20px' }}>
                {editingBook ? 'Edit Book / Notes Details' : 'Add New Book / Notes'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="admin-form-group">
                  <label className="admin-label">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Code of Civil Procedure Quick Revision Notes"
                    className="admin-input"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="admin-select"
                      style={{ width: '100%', borderRadius: '12px' }}
                    >
                      <option value="Exam Materials">Exam Materials</option>
                      <option value="Question Bank">Question Bank</option>
                      <option value="Revision Chart">Revision Chart</option>
                      <option value="Subject wise Notes">Subject wise Notes</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Icon Emoji</label>
                    <input
                      type="text"
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      placeholder="📘"
                      className="admin-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Original Price (e.g. ₹299)</label>
                    <input
                      type="text"
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Sale Price (e.g. ₹99)</label>
                    <input
                      type="text"
                      value={form.salePrice}
                      onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                      className="admin-input"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Badge Label (e.g. Sale!, 50% Off)</label>
                    <input
                      type="text"
                      value={form.badge}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Published Date</label>
                    <input
                      type="text"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      placeholder="e.g. Nov 2026"
                      className="admin-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="admin-btn admin-btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
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
