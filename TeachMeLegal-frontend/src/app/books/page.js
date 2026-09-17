"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import './books.css';

const DEFAULT_BOOKS = [
  {
    id: "book-1",
    title: 'Prevention of Money Laundering Act, 2002',
    category: 'Exam Material',
    originalPrice: '₹299',
    salePrice: '₹99',
    badge: 'Sale',
    badgeColor: '#22c55e',
    coverColor: '#1e3a5f',
    icon: '📘'
  },
  {
    id: "book-2",
    title: 'Question Bank of Indian Legal and Constitutional History',
    category: 'Question Bank',
    originalPrice: '₹199',
    salePrice: '₹49',
    badge: 'Sale',
    badgeColor: '#22c55e',
    coverColor: '#3b82f6',
    icon: '📙'
  },
  {
    id: "book-3",
    title: 'Question Bank of Environmental Law',
    category: 'Question Bank',
    originalPrice: '₹199',
    salePrice: '₹49',
    badge: '49% Off',
    badgeColor: '#f59e0b',
    coverColor: '#16a34a',
    icon: '📗'
  },
  {
    id: "book-4",
    title: 'Question Bank of Jurisprudence',
    category: 'Question Bank',
    originalPrice: '₹199',
    salePrice: '₹99',
    badge: 'Hot',
    badgeColor: '#ef4444',
    coverColor: '#7c3aed',
    icon: '📕'
  },
  {
    id: "book-5",
    title: 'Revision Book of Jurisprudence',
    category: 'Revision Chart',
    originalPrice: '₹350',
    salePrice: '₹45',
    badge: 'Sale',
    badgeColor: '#22c55e',
    coverColor: '#92400e',
    icon: '📔'
  },
  {
    id: "book-6",
    title: 'Jurisprudence Notes & Case Briefs',
    category: 'Exam Material',
    originalPrice: '₹600',
    salePrice: '₹99',
    badge: 'Bestseller',
    badgeColor: '#3b82f6',
    coverColor: '#1e3a5f',
    icon: '⚖️'
  },
  {
    id: "book-7",
    title: 'Revision Book of Environmental Law',
    category: 'Revision Chart',
    originalPrice: '₹199',
    salePrice: '₹47',
    badge: 'Sale',
    badgeColor: '#22c55e',
    coverColor: '#166534',
    icon: '🌿'
  },
  {
    id: "book-8",
    title: 'International Law Notes',
    category: 'Exam Material',
    originalPrice: '₹400',
    salePrice: '₹49',
    badge: 'Sale',
    badgeColor: '#22c55e',
    coverColor: '#0369a1',
    icon: '🌐'
  }
];

const CATEGORIES = ['All', 'Exam Material', 'Question Bank', 'Revision Chart'];

export default function BooksPage() {
  const { addToCart } = useCart();
  const [booksList, setBooksList] = useState(DEFAULT_BOOKS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedIds, setAddedIds] = useState([]);

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch('/api/admin/books');
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
    const matchesCategory = activeFilter === 'All' || book.category === activeFilter;
    const matchesSearch = !searchQuery || book.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (book) => {
    addToCart(book);
    setAddedIds(prev => [...prev, book.id]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(id => id !== book.id));
    }, 2000);
  };

  return (
    <main className="books-page">
      <Navbar />

      {/* Hero Header */}
      <section className="books-hero">
        <div className="books-hero-bg" aria-hidden="true" />
        <div className="container books-hero-container">
          <span className="books-badge">📚 LEGAL STUDY MATERIAL</span>
          <h1 className="books-hero-title">Books & Notes by Adv. Prashant Jha</h1>
          <p className="books-hero-sub">
            Syllabus-aligned subject notes, jurisprudence revision charts, and question banks compiled from real courtroom advocacy experience.
          </p>

          {/* Search Box */}
          <div className="books-search-wrapper">
            <input
              type="text"
              placeholder="Search books, notes, or topics (e.g. Jurisprudence, Money Laundering)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="books-search-input"
            />
            <span className="books-search-icon">🔍</span>
          </div>
        </div>
      </section>

      {/* Main Books Catalog */}
      <section className="books-catalog-section">
        <div className="container">

          {/* Discount Banner Strip */}
          <div className="discount-strip">
            <div className="discount-strip-icon">🎁</div>
            <div className="discount-strip-text">
              <strong>10% INSTANT DISCOUNT</strong> on purchasing 3 or more Subject-wise Notes! Discount applies automatically in cart.
            </div>
          </div>

          {/* Filter Bar */}
          <div className="books-filter-bar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`books-filter-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Empty Search Fallback */}
          {filtered.length === 0 && (
            <div className="books-empty-state">
              <span style={{ fontSize: '3rem' }}>🔍</span>
              <h3>No Books or Notes Found</h3>
              <p>We couldn't find any study materials matching "{searchQuery}". Try searching for another subject.</p>
              <button onClick={() => { setSearchQuery(''); setActiveFilter('All'); }} className="btn btn-secondary" style={{ marginTop: '15px' }}>
                Reset Filters
              </button>
            </div>
          )}

          {/* Books Grid */}
          <div className="books-grid">
            {filtered.map(book => {
              const isAdded = addedIds.includes(book.id);
              return (
                <div key={book.id} className="book-card">
                  <div className="book-cover" style={{ backgroundColor: book.coverColor || '#1e3a5f' }}>
                    <span className="book-cover-icon">{book.icon || '📖'}</span>
                    {book.badge && (
                      <span className="book-badge" style={{ backgroundColor: book.badgeColor || '#22c55e' }}>
                        {book.badge}
                      </span>
                    )}
                  </div>
                  <div className="book-info">
                    <span className="book-category">{book.category}</span>
                    <h3 className="book-title">{book.title}</h3>
                    <div className="book-pricing">
                      {book.originalPrice && (
                        <span className="book-original-price">{book.originalPrice}</span>
                      )}
                      <span className="book-sale-price">{book.salePrice}</span>
                    </div>
                    <button
                      className={`book-buy-btn ${isAdded ? 'added' : ''}`}
                      onClick={() => handleAddToCart(book)}
                    >
                      {isAdded ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
