"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import './courses.css';

const DEFAULT_COURSES = [
  {
    id: "course-1",
    title: 'Prevention of Money Laundering Act, 2002',
    category: 'Exam Materials',
    originalPrice: '₹299.00',
    salePrice: '₹99.00',
    numericPrice: 99,
    badge: 'Sale!',
    image: '/books/money-laundering-act-2002.png',
    author: 'Adv. Prashant Jha',
    active: true
  },
  {
    id: "course-2",
    title: 'Question Bank of Indian Legal and Constitutional History',
    category: 'Question Bank',
    originalPrice: '₹199.00',
    salePrice: '₹49.00',
    numericPrice: 49,
    badge: 'Sale!',
    image: '/books/question-bank-constitutional-history.png',
    author: 'Adv. Prashant Jha',
    active: true
  },
  {
    id: "course-3",
    title: 'Question Bank of Environmental Law',
    category: 'Question Bank',
    originalPrice: '₹199.00',
    salePrice: '₹49.00',
    numericPrice: 49,
    badge: 'Sale!',
    image: '/books/question-bank-environmental-law.png',
    author: 'Adv. Prashant Jha',
    active: true
  },
  {
    id: "course-4",
    title: 'Question Bank of Jurisprudence',
    category: 'Question Bank',
    originalPrice: '₹149.00',
    salePrice: '₹49.00',
    numericPrice: 49,
    badge: 'Sale!',
    image: '/books/question-bank-jurisprudence.png',
    author: 'Adv. Prashant Jha',
    active: true
  },
  {
    id: "course-5",
    title: 'Revision Book of Jurisprudence',
    category: 'Revision Chart',
    originalPrice: '₹350.00',
    salePrice: '₹45.00',
    numericPrice: 45,
    badge: 'Sale!',
    image: '/books/revision-jurisprudence.jpeg',
    author: 'Adv. Prashant Jha',
    active: true
  },
  {
    id: "course-6",
    title: 'Jurisprudence Notes & Masterclass',
    category: 'Subject wise Notes',
    originalPrice: '₹600.00',
    salePrice: '₹99.00',
    numericPrice: 99,
    badge: 'Sale!',
    image: '/books/jurisprudence-notes.jpg',
    author: 'Adv. Prashant Jha',
    active: true
  },
  {
    id: "course-7",
    title: 'Banking Law & SBI Act 1955 Course',
    category: 'Subject wise Notes',
    originalPrice: '₹299.00',
    salePrice: '₹99.00',
    numericPrice: 99,
    badge: 'Sale!',
    image: '/books/banking-law-notes.jpg',
    author: 'Adv. Prashant Jha',
    active: true
  },
  {
    id: "course-8",
    title: 'Environmental Law in India Course',
    category: 'Exam Materials',
    originalPrice: '₹299.00',
    salePrice: '₹99.00',
    numericPrice: 99,
    badge: 'Sale!',
    image: '/books/environmental-law-in-india.png',
    author: 'Adv. Prashant Jha',
    active: true
  },
  {
    id: "course-9",
    title: 'Revision Book of Environmental Law',
    category: 'Revision Chart',
    originalPrice: '₹249.00',
    salePrice: '₹49.00',
    numericPrice: 49,
    badge: 'Sale!',
    image: '/books/revision-environmental-law.jpeg',
    author: 'Adv. Prashant Jha',
    active: true
  },
  {
    id: "course-10",
    title: 'Indian Legal & Constitutional History Course',
    category: 'Subject wise Notes',
    originalPrice: '₹399.00',
    salePrice: '₹99.00',
    numericPrice: 99,
    badge: 'Sale!',
    image: '/books/indian-legal-constitutional-history.png',
    author: 'Adv. Prashant Jha',
    active: true
  }
];

const CATEGORIES_LIST = [
  { name: 'Exam Materials', count: 2 },
  { name: 'Question Bank', count: 3 },
  { name: 'Revision Chart', count: 2 },
  { name: 'Subject wise Notes', count: 3 },
];

export default function CoursesPage() {
  const { addToCart } = useCart();
  const [coursesList, setCoursesList] = useState(DEFAULT_COURSES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(199);
  const [addedIds, setAddedIds] = useState([]);

  useEffect(() => {
    async function loadCoursesData() {
      try {
        const res = await fetch('/api/admin/books');
        const data = await res.json();
        if (data.success && data.books && data.books.length > 0) {
          setCoursesList(data.books.filter(b => b.active !== false));
        }
      } catch (err) {
        // Fallback to static list
      }
    }
    loadCoursesData();
  }, []);

  const filtered = coursesList.filter(course => {
    const matchesCategory = activeCategory === 'All' || course.category.toLowerCase().trim() === activeCategory.toLowerCase().trim();
    const matchesSearch = !searchQuery || course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const coursePrice = course.numericPrice || parseFloat(course.salePrice?.replace(/[^0-9.]/g, '') || 99);
    const matchesPrice = coursePrice <= priceRange;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const handleAddToCart = (course) => {
    addToCart(course);
    setAddedIds(prev => [...prev, course.id]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(id => id !== course.id));
    }, 2000);
  };

  return (
    <main className="courses-page-wrapper">
      <Navbar />

      {/* Top Hero Banner Section */}
      <section className="courses-hero-section">
        <div className="courses-hero-container">
          <span className="capsule-badge-gold mb-3">📚 EXPLORE OUR LEGAL LIBRARY</span>
          <h1 className="courses-hero-title">
            Master Indian Law with <span className="gold-text">Structured Courses</span>
          </h1>
          <p className="courses-hero-subtitle">
            Practical video lectures, exam revision charts, and courtroom case study guides created by practicing Advocate Prashant Jha.
          </p>
        </div>
      </section>

      {/* Storefront Catalog Area (Sidebar + Grid) */}
      <section className="storefront-section">
        <div className="container storefront-container">

          {/* Left Sidebar */}
          <aside className="storefront-sidebar">

            {/* Search Courses */}
            <div className="sidebar-box search-box">
              <h4 className="sidebar-box-title">Search Courses..</h4>
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sidebar-search-input"
                />
                <button className="search-submit-btn" aria-label="Search">🔍</button>
              </div>
            </div>

            {/* Price Filter */}
            <div className="sidebar-box filter-box">
              <h4 className="sidebar-box-title">Filter</h4>
              <div className="price-slider-wrapper">
                <input
                  type="range"
                  min="40"
                  max="199"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="price-range-slider"
                />
                <div className="price-slider-labels">
                  <span className="price-badge">₹40</span>
                  <span className="price-badge active-price">₹{priceRange}</span>
                </div>
              </div>
              <button className="btn-apply-filter">Filter</button>
            </div>

            {/* Categories */}
            <div className="sidebar-box categories-box">
              <h4 className="sidebar-box-title">Categories</h4>
              <ul className="categories-list">
                <li
                  className={`category-item ${activeCategory === 'All' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('All')}
                >
                  <span className="cat-name">All Products</span>
                  <span className="cat-count">({coursesList.length})</span>
                </li>
                {CATEGORIES_LIST.map(cat => (
                  <li
                    key={cat.name}
                    className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.name)}
                  >
                    <span className="cat-name">{cat.name}</span>
                    <span className="cat-count">({cat.count})</span>
                  </li>
                ))}
              </ul>
            </div>

          </aside>

          {/* Right Product Grid Area */}
          <div className="storefront-main">

            {filtered.length === 0 ? (
              <div className="books-empty-state">
                <span className="empty-icon">🔍</span>
                <h3>No Courses Found</h3>
                <p>We couldn't find any courses matching your filter criteria.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); setPriceRange(199); }}
                  className="btn-reset-filters"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {filtered.map(course => {
                    const isAdded = addedIds.includes(course.id);
                    return (
                      <div key={course.id} className="product-card">
                        <div className="card-top-image">
                          {course.badge && <span className="sale-ribbon">{course.badge}</span>}
                          <img
                            src={course.image}
                            alt={course.title}
                            className="book-cover-image"
                          />
                          <div className="card-hover-actions">
                            <button
                              onClick={() => handleAddToCart(course)}
                              className="hover-action-btn"
                              title="Add to Cart"
                            >
                              🛍️
                            </button>
                            <button className="hover-action-btn" title="Compare">
                              ⚖️
                            </button>
                            <button className="hover-action-btn" title="Quick View">
                              🔗
                            </button>
                          </div>
                        </div>

                        <div className="card-body">
                          <div className="product-pricing">
                            {course.originalPrice && (
                              <span className="original-price">{course.originalPrice}</span>
                            )}
                            <span className="sale-price">{course.salePrice}</span>
                          </div>

                          <h3 className="product-title" title={course.title}>
                            {course.title}
                          </h3>

                          <button
                            className={`btn-add-cart-main ${isAdded ? 'added' : ''}`}
                            onClick={() => handleAddToCart(course)}
                          >
                            {isAdded ? '✓ Added' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
