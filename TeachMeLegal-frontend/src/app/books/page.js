"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import './books.css';

const DEFAULT_BOOKS = [
  {
    id: "book-1",
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
    id: "book-2",
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
    id: "book-3",
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
    id: "book-4",
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
    id: "book-5",
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
    id: "book-6",
    title: 'Jurisprudence Notes',
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
    id: "book-7",
    title: 'Banking Law Notes',
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
    id: "book-8",
    title: 'Environmental Law in India',
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
    id: "book-9",
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
    id: "book-10",
    title: 'Indian Legal & Constitutional History',
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
  { name: 'Video Lectures', count: 0 },
];

export default function BooksPage() {
  const { addToCart } = useCart();
  const [booksList, setBooksList] = useState(DEFAULT_BOOKS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(199);
  const [addedIds, setAddedIds] = useState([]);

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch('http://localhost:3001/api/admin/books');
        const data = await res.json();
        if (data.success && data.books && data.books.length > 0) {
          setBooksList(data.books.filter(b => b.active !== false));
        }
      } catch (err) {
        console.error('Failed to load books from server:', err);
      }
    }
    loadBooks();
  }, []);

  const filtered = booksList.filter(book => {
    const matchesCategory = activeCategory === 'All' || book.category.toLowerCase().trim() === activeCategory.toLowerCase().trim();
    const matchesSearch = !searchQuery || book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const bookPrice = book.numericPrice || parseFloat(book.salePrice?.replace(/[^0-9.]/g, '') || 99);
    const matchesPrice = bookPrice <= priceRange;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const handleAddToCart = (book) => {
    addToCart(book);
    setAddedIds(prev => [...prev, book.id]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(id => id !== book.id));
    }, 2000);
  };

  return (
    <main className="books-page-wrapper">
      <Navbar />

      {/* Top Banner / Hero Header */}
      <section className="books-hero-header">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-main-title">Courses</h1>
        </div>
      </section>

      {/* Main Storefront Area (Sidebar + Grid) */}
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
              <button className="btn-apply-filter" onClick={() => {}}>Filter</button>
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
                  <span className="cat-count">({booksList.length})</span>
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
                <h3>No Courses or Books Found</h3>
                <p>We couldn't find any items matching your filter criteria.</p>
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
                  {filtered.map(book => {
                    const isAdded = addedIds.includes(book.id);
                    return (
                      <div key={book.id} className="product-card">
                        <div className="card-top-image">
                          {book.badge && <span className="sale-ribbon">{book.badge}</span>}
                          <Link href={`/books/${book.id}`}>
                            <img
                              src={book.image}
                              alt={book.title}
                              className="book-cover-image"
                              style={{ cursor: 'pointer' }}
                            />
                          </Link>
                          {/* Hover action overlay */}
                          <div className="card-hover-actions">
                            <button
                              onClick={() => handleAddToCart(book)}
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
                            {book.originalPrice && (
                              <span className="original-price">{book.originalPrice}</span>
                            )}
                            <span className="sale-price">{book.salePrice}</span>
                          </div>

                          <Link href={`/books/${book.id}`} style={{ textDecoration: 'none' }}>
                            <h3 className="product-title" title={book.title} style={{ cursor: 'pointer' }}>
                              {book.title}
                            </h3>
                          </Link>

                          <button
                            className={`btn-add-cart-main ${isAdded ? 'added' : ''}`}
                            onClick={() => handleAddToCart(book)}
                          >
                            {isAdded ? '✓ Added' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load More Button */}
                <div className="load-more-wrapper">
                  <button className="btn-load-more">Load More</button>
                </div>
              </>
            )}

          </div>

        </div>
      </section>

      {/* Sub-Hero Section ("Learn Law with Adv. Prashant") */}
      <section className="teacher-feature-section">
        <div className="container teacher-feature-container">
          <span className="feature-small-label">Courses</span>
          <div className="dots-divider">
            <span></span><span></span><span></span>
          </div>
          <span className="feature-sub-title">Enroll Now & Master Law</span>
          <h2 className="teacher-main-heading">
            Learn Law with <span className="highlight-blue">Adv. Prashant</span>
          </h2>
          <p className="teacher-description">
            At <strong>Teach Me Legal</strong>, Advocate Prashant Jha, have carefully designed a range of <strong>comprehensive law courses</strong> to help students and aspiring legal professionals build strong conceptual clarity and practical understanding.
          </p>
          <p className="teacher-description secondary">
            These courses are not just theoretical—they are enriched with real <strong>courtroom insights, practical examples, and exam-oriented guidance</strong>, making them ideal for law students, judiciary aspirants, and anyone serious about mastering law.
          </p>

          <div className="teacher-cta-buttons">
            <button className="btn-view-course">VIEW COURSE</button>
            <button className="btn-download-app">DOWNLOAD APP</button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
