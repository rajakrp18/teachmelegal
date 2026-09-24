"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useCart } from '../../../context/CartContext';
import './book-detail.css';

export default function BookDetailPage({ params }) {
  const { id } = params;
  const { addToCart } = useCart();
  
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review form state
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch book details from admin panel
    fetch('http://localhost:3001/api/admin/books')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.books) {
          const foundBook = data.books.find(b => b.id === id);
          if (foundBook) setBook(foundBook);
        }
      })
      .catch(err => console.error('Error fetching book', err));

    // Fetch reviews for this book
    fetch(`http://localhost:5000/api/books/${id}/reviews`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReviews(data.reviews);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reviews', err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`http://localhost:5000/api/books/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, rating, comment })
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setUserName('');
        setRating(5);
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting review', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="book-detail-page">
        <Navbar />
        <div className="container loading-state"><h2>Loading book details...</h2></div>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="book-detail-page">
        <Navbar />
        <div className="container not-found-state"><h2>Book not found</h2></div>
      </main>
    );
  }

  const averageRating = reviews.length 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <main className="book-detail-page">
      <Navbar />
      
      {/* Product Detail Section */}
      <section className="product-detail-hero">
        <div className="container product-detail-grid">
          <div className="product-image-col">
            <div className="product-image-wrapper">
              <img src={book.image} alt={book.title} className="detail-image" />
            </div>
          </div>
          
          <div className="product-info-col">
            <span className="detail-category">{book.category}</span>
            <h1 className="detail-title">{book.title}</h1>
            
            <div className="detail-rating-summary">
              <span className="stars">{'★'.repeat(Math.round(averageRating))}</span>
              <span className="rating-score">{averageRating}</span>
              <span className="review-count">({reviews.length} reviews)</span>
            </div>
            
            <div className="detail-price-box">
              {book.originalPrice && <span className="detail-original-price">{book.originalPrice}</span>}
              <span className="detail-sale-price">{book.salePrice}</span>
            </div>
            
            <p className="detail-description">{book.description}</p>
            
            <div className="detail-actions">
              <button className="btn-add-to-cart-large" onClick={() => addToCart(book)}>
                🛍️ Add to Cart
              </button>
            </div>
            
            <div className="detail-meta">
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Format:</strong> Digital PDF</p>
              <p><strong>Access:</strong> Lifetime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ratings & Reviews Section */}
      <section className="reviews-section-container">
        <div className="container">
          <div className="reviews-layout">
            
            {/* Write a review form */}
            <div className="review-form-col">
              <h2 className="reviews-heading">Write a Review</h2>
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="form-group">
                  <label>Your Rating</label>
                  <div className="rating-selector">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`star-select ${rating >= star ? 'active' : ''}`}
                        onClick={() => setRating(star)}
                      >★</span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Your Review</label>
                  <textarea 
                    placeholder="What did you think about this material?" 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    rows="5" 
                    required 
                  ></textarea>
                </div>
                <button type="submit" className="btn-submit-review" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>

            {/* List of comments */}
            <div className="comments-list-col">
              <h2 className="reviews-heading">Student Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <div className="no-reviews-box">
                  <p>No reviews yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="comments-list">
                  {reviews.map((rev, index) => (
                    <div key={rev.id || index} className="comment-card">
                      <div className="comment-header">
                        <div className="comment-avatar">{(rev.userName || 'A')[0].toUpperCase()}</div>
                        <div className="comment-meta">
                          <strong className="comment-author">{rev.userName || 'Anonymous'}</strong>
                          <div className="comment-stars">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                        </div>
                        <div className="comment-date">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="comment-body">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
