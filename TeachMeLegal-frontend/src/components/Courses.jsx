"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PdfPreviewModal from './PdfPreviewModal';
import { GridSkeleton } from './SkeletonLoader';
import './Courses.css';

const MOCK_COURSES = [
  {
    id: 1,
    title: 'Criminal Law Fundamentals',
    category: 'Course',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    price: '₹499',
    numericPrice: 499,
    rating: '4.9',
    students: '2.5k'
  },
  {
    id: 2,
    title: 'The Constitution Explained (Revision Chart)',
    category: 'Book',
    image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800',
    price: '₹249',
    salePrice: '₹99',
    numericPrice: 99,
    rating: '4.8',
    students: '5k+'
  },
  {
    id: 3,
    title: 'Corporate Law Masterclass',
    category: 'Course',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    price: '₹899',
    numericPrice: 899,
    rating: '5.0',
    students: '1.2k'
  },
  {
    id: 4,
    title: 'JAIIB / CAIIB Legal Aspects Guide',
    category: 'Book',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66cb85?auto=format&fit=crop&q=80&w=800',
    price: '₹599',
    salePrice: '₹149',
    numericPrice: 149,
    rating: '4.9',
    students: '4.1k'
  },
  {
    id: 5,
    title: 'Rights & Remedies Handbook',
    category: 'Book',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    price: '₹199',
    salePrice: '₹99',
    numericPrice: 99,
    rating: '4.9',
    students: '8k+'
  },
  {
    id: 6,
    title: 'Evidence Act Simplified',
    category: 'Course',
    image: 'https://images.unsplash.com/photo-1423592707957-3b212afa6733?auto=format&fit=crop&q=80&w=800',
    price: '₹699',
    numericPrice: 699,
    rating: '4.8',
    students: '1.8k'
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
  const [isInitialLoading, setIsInitialLoading] = useState(false);
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
        console.log('Using static curated course & book list.');
      }
    }
    loadCourses();
  }, []);

  const filteredItems = courses.filter(item => {
    if (filter === 'All') return true;
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
        alert(`Order initiated for ${course.title} (₹${course.numericPrice})! Connect backend keys for live payment.`);
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
        theme: { color: '#0a192f' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      alert(`Course checkout: ${course.title} — ₹${course.numericPrice}`);
    }
    setLoadingId(null);
  };

  return (
    <section id="courses" className="courses-section">
      <div className="container">
        <div className="courses-header">
          <div>
            <h2 className="section-title">Learn with Me</h2>
            <h3 className="courses-main-title">Premium Courses & Study Books</h3>
          </div>
          
          <div className="filter-buttons">
            {['All', 'Course', 'Book'].map(cat => (
              <button 
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}s
              </button>
            ))}
          </div>
        </div>

        {isInitialLoading ? (
          <GridSkeleton count={6} />
        ) : (
          <motion.div 
            className="courses-grid"
            layout
          >
            <AnimatePresence>
              {filteredItems.map(item => (
                <motion.div 
                  key={item.id}
                  className="course-card"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="course-image" style={{ backgroundImage: `url(${item.image})` }}>
                    <span className="category-badge">{item.category}</span>
                    {item.category === 'Book' && (
                      <button 
                        className="preview-sample-badge"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBookForPreview(item);
                        }}
                      >
                        👁️ Sample PDF
                      </button>
                    )}
                  </div>
                  <div className="course-info">
                    <h4 className="course-title">{item.title}</h4>
                    <div className="course-meta">
                      <span className="rating">★ {item.rating}</span>
                      <span className="students">👥 {item.students}</span>
                    </div>
                    <div className="course-footer">
                      <span className="price">{item.salePrice || item.price}</span>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleCheckout(item)}
                        disabled={loadingId === item.id}
                      >
                        {loadingId === item.id ? 'Processing...' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        
        <div className="view-all-container">
          <button className="btn btn-primary">View All Resources</button>
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

