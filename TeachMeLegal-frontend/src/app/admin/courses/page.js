"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
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
    active: true
  });

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
      active: true
    });
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm(course);
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

  return (
    <>
      <header className="admin-header">
        <h1 className="admin-header-title">Courses & Video Lectures Management</h1>
        <div className="admin-header-actions">
          <button onClick={openAddModal} className="admin-btn admin-btn-primary">
            ➕ Add New Course
          </button>
        </div>
      </header>

      <main className="admin-content">
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">All Active & Inactive Courses ({courses.length})</h2>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Students Enrolled</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Loading courses...</td>
                  </tr>
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No courses added yet.</td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course.id}>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{course.title}</td>
                      <td>
                        <span className="badge" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                          {course.category}
                        </span>
                      </td>
                      <td><strong>{course.price}</strong></td>
                      <td>👥 {course.students}</td>
                      <td>★ {course.rating}</td>
                      <td>
                        <span className={`badge ${course.active ? 'badge-published' : 'badge-draft'}`}>
                          {course.active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => openEditModal(course)} className="admin-btn admin-btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(course.id, course.title)} className="admin-btn admin-btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
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
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <div className="admin-card" style={{ width: '100%', maxWidth: '600px', padding: '32px', margin: 0, maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 className="admin-card-title" style={{ marginBottom: '20px' }}>
                {editingCourse ? 'Edit Course Details' : 'Add New Course'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="admin-form-group">
                  <label className="admin-label">Course Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="admin-input"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Display Price (e.g. ₹499 or $49)</label>
                    <input
                      type="text"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="admin-input"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Numeric Price (for Payment Gateway)</label>
                    <input
                      type="number"
                      value={form.numericPrice}
                      onChange={(e) => setForm({ ...form, numericPrice: parseFloat(e.target.value) })}
                      className="admin-input"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Rating (e.g. 4.9)</label>
                    <input
                      type="text"
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: e.target.value })}
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Enrolled Students Count</label>
                    <input
                      type="text"
                      value={form.students}
                      onChange={(e) => setForm({ ...form, students: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Cover Image URL</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Course Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="admin-textarea"
                    style={{ minHeight: '100px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="admin-btn admin-btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn admin-btn-primary">
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
