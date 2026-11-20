"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PdfPreviewModal from './PdfPreviewModal';
import { IconBookOpen, IconEye, IconArrowUpRight } from './Icons';
import './Courses.css';

const REAL_BOOKS = [
  {
    id: "book-1",
    title: 'Prevention of Money Laundering Act, 2002',
    category: 'EXAM MATERIALS',
    type: 'Book',
    image: '/books/money-laundering-act-2002.png',
    price: '₹299',
    salePrice: '₹99',
    numericPrice: 99,
    description: 'Comprehensive statutory guide, key case laws, and exam notes for Money Laundering Act 2002.'
  },
  {
    id: "book-7",
    title: 'Banking Law Notes',
    category: 'SUBJECT NOTES',
    type: 'Book',
    image: '/books/banking-law-notes.jpg',
    price: '₹299',
    salePrice: '₹99',
    numericPrice: 99,
    description: 'Complete Banking Law study notes, SBI Act 1955, rights of set-off, and RBI regulation.'
  },
  {
    id: "book-6",
    title: 'Jurisprudence Notes',
    category: 'SUBJECT NOTES',
    type: 'Book',
    image: '/books/jurisprudence-notes.jpg',
    price: '₹600',
    salePrice: '₹99',
    numericPrice: 99,
    description: 'Master legal theory, schools of jurisprudence, rights, duties, and judicial precedents.'
  },
  {
    id: "book-8",
    title: 'Environmental Law in India',
    category: 'EXAM MATERIALS',
    type: 'Book',
    image: '/books/environmental-law-in-india.png',
    price: '₹299',
    salePrice: '₹99',
    numericPrice: 99,
    description: 'Comprehensive guide to Environmental Protection Act, NGT judgments, and constitutional writs.'
  },
  {
    id: "book-2",
    title: 'Question Bank of Legal History',
    category: 'QUESTION BANK',
    type: 'Book',
    image: '/books/question-bank-constitutional-history.png',
    price: '₹199',
    salePrice: '₹49',
    numericPrice: 49,
    description: 'High-yield previous year question bank with solved model answers for constitutional history.'
  },
  {
    id: "book-5",
    title: 'Revision Book of Jurisprudence',
    category: 'REVISION CHART',
    type: 'Book',
    image: '/books/revision-jurisprudence.jpeg',
    price: '₹350',
    salePrice: '₹45',
    numericPrice: 45,
    description: 'Quick revision charts and exam summaries for last-minute judiciary preparation.'
  }
];

const Courses = () => {
  const [courses, setCourses] = useState(REAL_BOOKS);
  const [selectedBookForPreview, setSelectedBookForPreview] = useState(null);
  const { addToCart, setIsCartOpen } = require('../context/CartContext').useCart();

  React.useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch('http://localhost:5000/api/books');
        const data = await res.json();
        if (data.success && data.books && data.books.length > 0) {
          const mapped = data.books.slice(0, 6).map(b => ({
            id: b.id || b._id,
            title: b.title,
            category: (b.category || 'EXAM MATERIAL').toUpperCase(),
            type: 'Book',
            image: b.image || '/books/money-laundering-act-2002.png',
            price: b.originalPrice || '₹299',
            salePrice: b.salePrice || '₹99',
            numericPrice: b.numericPrice || 99,
            description: b.description || 'Structured law notes and exam revision chart by Advocate Prashant Jha.'
          }));
          setCourses(mapped);
        }
      } catch (err) {
        // Fallback to real static books list
      }
    }
    loadBooks();
  }, []);

  const handleAddToCart = (course) => {
    addToCart(course);
    setIsCartOpen(true);
  };

  return (
    <section id="courses" className="courses-section">
      <div className="container">
        {/* Dark Rounded Container Box */}
        <div className="dark-container-wrapper">

          {/* Section Header */}
          <div className="courses-header-row">
            <div>
              <span className="capsule-badge-gold">
                <span className="badge-icon"><IconBookOpen size={13} /></span>
                <span>CURATED ACADEMIC CURRICULUM</span>
              </span>
              <h2 className="dark-section-title">Master Indian Law</h2>
            </div>

            <div className="header-right-controls">
              <p className="dark-section-sub">
                Explore curated legal courses, statutory study books, and judiciary exam charts created by practicing Advocate Prashant Jha.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <motion.div className="practice-cards-grid" layout>
            <AnimatePresence>
              {courses.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  className={`practice-card ${idx === 1 ? 'featured-active' : ''}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Card Image Banner - Uncropped Full View */}
                  <div className="card-image-wrapper">
                    <img src={item.image} alt={item.title} className="card-book-img" />
                    <div className="card-overlay" />
                    <span className="category-pill-tag">{item.category}</span>

                    <button 
                      className="btn-sample-badge"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBookForPreview(item);
                      }}
                    >
                      <span className="sample-icon-wrap"><IconEye size={12} /></span>
                      <span>Sample PDF</span>
                    </button>
                  </div>

                  {/* Card Content Body */}
                  <div className="card-content-body">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-snippet">{item.description}</p>
                    
                    <div className="card-footer-action">
                      <div className="price-tag">
                        <strong>{item.salePrice || item.price}</strong>
                        {item.salePrice && <span className="original-price">{item.price}</span>}
                      </div>

                      <button 
                        className="btn-circle-arrow"
                        onClick={() => handleAddToCart(item)}
                        title="Enroll Now"
                      >
                        <IconArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* PDF Sample Flipbook Modal */}
      <PdfPreviewModal
        isOpen={Boolean(selectedBookForPreview)}
        onClose={() => setSelectedBookForPreview(null)}
        book={selectedBookForPreview}
        onAddToCart={(book) => handleAddToCart(book)}
      />
    </section>
  );
};

export default Courses;
