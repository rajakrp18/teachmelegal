"use client";
import { useEffect, useState } from 'react';
import { IconSearch, IconGraduationCap, IconCalendar } from '@/components/Icons';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Course',
    price: '₹499',
    numericPrice: 499,
    rating: '4.9',
    students: '100+',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    description: '',
    driveUrl: '',
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
      formData.append('folder', isPdf ? 'courses/documents' : 'courses/covers');

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

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openAddModal = () => {
    setEditingCourse(null);
    setForm({
      title: '',
      category: 'Course',
      price: '₹499',
      numericPrice: 499,
      rating: '4.9',
      students: '100+',
      image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
      description: '',
      driveUrl: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      active: true
    });
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm({
      ...course,
      driveUrl: course.driveUrl || '',
      date: course.date || 'Nov 2026'
    });
    setShowModal(true);
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete course "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCourses(courses.filter(c => c.id !== id));
      } else {
        alert(data.error || 'Failed to delete course');
      }
    } catch (err) {
      alert('Error deleting course');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCourse ? `/api/admin/courses/${editingCourse.id}` : '/api/admin/courses';
      const method = editingCourse ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchCourses();
      } else {
        alert(data.error || 'Failed to save course');
      }
    } catch (err) {
      alert('Error saving course');
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

  const filteredCourses = courses.filter(c => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      c.title.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      c.category.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'Active' ? c.active : !c.active);

    let matchesDate = true;
    const itemDate = parseItemDate(c.date);
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
          <h1 className="admin-header-title">Courses & Video Lectures Management</h1>
          <p className="admin-header-subtitle">
            Curate supreme court masterclasses, statutory video handbooks, and curriculum.
          </p>
        </div>
        <div className="admin-header-actions">
          <button onClick={openAddModal} className="admin-btn admin-btn-primary">
            Add New Course
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
                  placeholder="Search courses by title..."
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
                <option value="Course">Course</option>
                <option value="Book">Book</option>
                <option value="Masterclass">Masterclass</option>
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
                  title="Filter courses published on or after this date"
                />
              </div>

              <div className="admin-date-picker-wrap">
                <label>To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="admin-date-input"
                  title="Filter courses published on or before this date"
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
              Showing {filteredCourses.length} of {courses.length} courses
            </span>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '55px', textAlign: 'center' }}>SL No.</th>
                  <th style={{ minWidth: '180px' }}>Course Title</th>
                  <th style={{ minWidth: '95px' }}>Category</th>
                  <th style={{ minWidth: '100px' }}>Published Date</th>
                  <th style={{ minWidth: '80px' }}>Price</th>
                  <th style={{ minWidth: '100px' }}>Students</th>
                  <th style={{ minWidth: '70px' }}>Rating</th>
                  <th style={{ minWidth: '85px' }}>Status</th>
                  <th style={{ minWidth: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '36px' }}>
                      <div className="admin-loading-spinner" style={{ margin: '0 auto 10px' }} />
                      Loading legal courses...
                    </td>
                  </tr>
                ) : filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--admin-text-sub)' }}>
                      No courses found matching current search and filters.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course, idx) => (
                    <tr key={course.id}>
                      <td style={{ fontWeight: 800, color: 'var(--admin-gold)', textAlign: 'center' }}>
                        #{idx + 1}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--admin-text-main)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img 
                            src={course.image} 
                            alt={course.title}
                            style={{ width: '34px', height: '34px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} 
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span>{course.title}</span>
                              {course.driveUrl && (
                                <a 
                                  href={course.driveUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="badge" 
                                  style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', border: '1px solid rgba(59, 130, 246, 0.25)', textDecoration: 'none', fontSize: '0.68rem', padding: '1px 6px' }}
                                  title="Open Direct Google Drive Link"
                                >
                                  Drive Link ↗
                                </a>
                              )}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--admin-text-sub)', fontWeight: 400 }}>
                              ID: {course.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: '#eff6ff', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.25)', fontSize: '0.74rem' }}>
                          {course.category}
                        </span>
                      </td>
                      <td style={{ color: 'var(--admin-text-sub)', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                        {course.date || 'Nov 2026'}
                      </td>
                      <td><strong style={{ fontSize: '0.84rem' }}>{course.price}</strong></td>
                      <td style={{ fontSize: '0.82rem' }}>{course.students} students</td>
                      <td style={{ fontSize: '0.82rem' }}>★ {course.rating}</td>
                      <td>
                        <span className={`badge ${course.active ? 'badge-published' : 'badge-draft'}`} style={{ fontSize: '0.74rem' }}>
                          {course.active ? '● Active' : '○ Hidden'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button onClick={() => openEditModal(course)} className="admin-btn admin-btn-primary" style={{ padding: '5px 10px', fontSize: '0.76rem' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(course.id, course.title)} className="admin-btn admin-btn-danger" style={{ padding: '5px 10px', fontSize: '0.76rem' }}>
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
                  {editingCourse ? 'Edit Course Details' : 'Add New Course'}
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
                      <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Course Title *</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                          <option value="Course">Course</option>
                          <option value="Book">Book</option>
                          <option value="Masterclass">Masterclass</option>
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
                        <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Display Price (₹499)</label>
                        <input
                          type="text"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          className="admin-input"
                          style={{ padding: '7px 11px', fontSize: '0.85rem', borderRadius: '8px' }}
                          required
                        />
                      </div>

                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Numeric Price</label>
                        <input
                          type="number"
                          value={form.numericPrice}
                          onChange={(e) => setForm({ ...form, numericPrice: parseFloat(e.target.value) })}
                          className="admin-input"
                          style={{ padding: '7px 11px', fontSize: '0.85rem', borderRadius: '8px' }}
                          required
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <label className="admin-label" style={{ fontSize: '0.74rem', margin: 0 }}>
                          Drive Link / PDF Material
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
                        placeholder="https://drive.google.com/... or uploaded syllabus PDF"
                        className="admin-input"
                        style={{ padding: '7px 11px', fontSize: '0.83rem', borderRadius: '8px' }}
                      />
                      <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-sub)', marginTop: '2px', display: 'block' }}>
                        {form.driveUrl ? (
                          <span style={{ color: 'var(--admin-gold)', fontWeight: 600 }}>
                            ✓ File attached: {form.driveUrl.startsWith('/') ? form.driveUrl.split('/').pop() : 'External link configured'}
                          </span>
                        ) : (
                          'Upload a course syllabus/PDF directly or paste a Drive/video link.'
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
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
                          placeholder="/courses/covers/... or https://..."
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
                        Upload a local course banner (PNG, JPG, WebP) or paste an image URL.
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Rating (e.g. 4.9)</label>
                        <input
                          type="text"
                          value={form.rating}
                          onChange={(e) => setForm({ ...form, rating: e.target.value })}
                          className="admin-input"
                          style={{ padding: '7px 11px', fontSize: '0.85rem', borderRadius: '8px' }}
                        />
                      </div>

                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Students Count</label>
                        <input
                          type="text"
                          value={form.students}
                          onChange={(e) => setForm({ ...form, students: e.target.value })}
                          className="admin-input"
                          style={{ padding: '7px 11px', fontSize: '0.85rem', borderRadius: '8px' }}
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginBottom: '10px' }}>
                      <label className="admin-label" style={{ fontSize: '0.74rem', marginBottom: '3px' }}>Course Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="admin-textarea"
                        rows={3}
                        style={{ padding: '7px 11px', fontSize: '0.83rem', borderRadius: '8px', minHeight: '68px', resize: 'vertical' }}
                      />
                    </div>

                    <div className="admin-form-group" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    {editingCourse ? 'Save Changes' : 'Create Course'}
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
