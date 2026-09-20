"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PdfPreviewModal from './PdfPreviewModal';
import { GridSkeleton } from './SkeletonLoader';
import './Courses.css';

const MOCK_COURSES = [
  {
    id: 1,
    title: 'Corporate & Business Law',
    category: 'CORPORATE',
    type: 'Course',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    price: '₹899',
    numericPrice: 899,
    rating: '5.0',
    students: '1.2k',
    description: 'Comprehensive legal support for startups, SMEs, and established businesses. From company formation to contract drafting.'
  },
  {
    id: 2,
    title: 'Civil & Criminal Litigation',
    category: 'LITIGATION',
    type: 'Course',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    price: '₹499',
    numericPrice: 499,
    rating: '4.9',
    students: '2.5k',
    description: 'Strong representation in civil disputes, IPC, & CrPC. Master every stage of court litigation, evidence, and cross-examination.'
  },
  {
    id: 3,
    title: 'Criminal Defense & Evidence',
    category: 'DEFENSE',
    type: 'Course',
    image: 'https://images.unsplash.com/photo-1423592707957-3b212afa6733?auto=format&fit=crop&q=80&w=800',
    price: '₹699',
    numericPrice: 699,
    rating: '4.8',
    students: '1.8k',
    description: 'Dedicated criminal law defense & Evidence Act insights. We focus on protecting constitutional rights and defense strategy.'
  },
  {
    id: 4,
    title: 'The Constitution Explained',
    category: 'CONSTITUTIONAL',
    type: 'Book',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800',
    price: '₹249',
    salePrice: '₹99',
    numericPrice: 99,
    rating: '4.8',
    students: '5k+',
    description: 'Complete Article-by-Article revision chart, landmark judgments summary, and fundamental rights handbook.'
  },
  {
    id: 5,
    title: 'JAIIB / CAIIB Legal Guide',
    category: 'BANKING',
    type: 'Book',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66cb85?auto=format&fit=crop&q=80&w=800',
    price: '₹599',
    salePrice: '₹149',
    numericPrice: 149,
    rating: '4.9',
    students: '4.1k',
    description: 'Banking regulatory operations, SBI Act 1955, set-off rights, and banking law exam prep guide.'
  },
  {
    id: 6,
    title: 'Rights & Remedies Handbook',
    category: 'PROPERTY',
    type: 'Book',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    price: '₹199',
    salePrice: '₹99',
    numericPrice: 99,
    rating: '4.9',
    students: '8k+',
    description: 'Practical guide to consumer protection, property rights, writs, and immediate legal remedies in India.'
  }
];

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Courses = () => {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [filter, setFilter] = useState('All');
  const [loadingId, setLoadingId] = useState(null);
  const [selectedBookForPreview, setSelectedBookForPreview] = useState(null);

  React.useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/admin/courses');
        const data = await res.json();
        if (data.success && data.courses && data.courses.length > 0) {
          setCourses(data.courses.filter(c => c.active));
        }
      } catch (err) {
        // Fallback to static list
      }
    }
    loadCourses();
  }, []);

  const filteredItems = courses.filter(item => {
    if (filter === 'All') return true;
    if (filter === 'Courses') return item.type === 'Course';
    if (filter === 'Books') return item.type === 'Book';
    return item.category === filter;
  });

  const handleCheckout = async (course) => {
    setLoadingId(course.id);
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoadingId(null);
      return;
    }

    try {
      const result = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: course.numericPrice, currency: 'INR' }),
      });
      const data = await result.json();

      if (!data.success) {
        alert(`Order initiated for ${course.title} (${course.salePrice || course.price})! Connect Razorpay keys for live payments.`);
        setLoadingId(null);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key_id',
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Teach Me Legal',
        description: `Enroll in ${course.title}`,
        order_id: data.order.id,
        handler: function (response) {
          alert(`Successfully enrolled in ${course.title}!`);
        },
        theme: { color: '#09131e' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      alert(`Checkout initiated for ${course.title}`);
    }
    setLoadingId(null);
  };

  return (
    <section id="courses" className="courses-section">
      <div className="container">
        {/* Dark Rounded Container Box Wrapping the Section */}
        <div className="dark-container-wrapper">
          <div className="courses-header-row">
            <div>
              <span className="capsule-badge mb-3">MY SERVICES & PRACTICE AREAS</span>
              <h2 className="dark-section-title">Trusted Expertise</h2>
            </div>
            
            <div className="header-right-controls">
              <p className="dark-section-sub">
                Delivering trusted legal courses & study resources with proven experience and a results-driven focus.
              </p>
              
              <div className="filter-capsules" style={{ display: 'none' }}>
              </div>
            </div>
          </div>

          {/* Cards Grid / Carousel */}
          <motion.div className="practice-cards-grid" layout>
            <AnimatePresence>
              {filteredItems.map((item, idx) => (
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
                  {/* Card Image Banner */}
                  <div className="card-image-bg" style={{ backgroundImage: `url(${item.image})` }}>
                    <div className="card-overlay" />
                    <span className="category-pill-tag">{item.category}</span>

                    {item.type === 'Book' && (
                      <button 
                        className="btn-sample-badge"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBookForPreview(item);
                        }}
                      >
                        👁️ Sample PDF
                      </button>
                    )}
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
                        onClick={() => handleCheckout(item)}
                        disabled={loadingId === item.id}
                        title="Enroll Now"
                      >
                        {loadingId === item.id ? '...' : '↗'}
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
        onAddToCart={(book) => handleCheckout(book)}
      />
    </section>
  );
};

export default Courses;
