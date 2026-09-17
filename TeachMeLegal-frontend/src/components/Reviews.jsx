"use client";
import React from 'react';
import './Reviews.css';

const REVIEWS_DATA = [
  {
    id: 1,
    name: "Priyanka Kashyap",
    role: "Student",
    avatar: "👩‍🎓",
    content: "What an Explanation!! Exceptionally good. Thankyou so much sir, Tommorow is my exam and just like many padhne baithi and surprisingly understood everything.",
    rating: 5,
    course: "Constitutional Law"
  },
  {
    id: 2,
    name: "Shruti Sharma",
    role: "LL.B Student",
    avatar: "👩‍⚖️",
    content: "Thank you so much Prashant Sir. Jiski kitaab dekhne ka mann tak nahi karta usko aapne mere liye ekdam asaan kar diya. Behad shukriya aapka.",
    rating: 5,
    course: "Banking Law"
  },
  {
    id: 3,
    name: "Anand Kashyap",
    role: "Law Aspirant",
    avatar: "👨‍🎓",
    content: "Sir I am a law student. I really thankful to u sir for making this video about legal history. It really helpful for me and my colleagues.",
    rating: 5,
    course: "Legal History"
  },
  {
    id: 4,
    name: "Vikramaditya Singh",
    role: "Judiciary Aspirant",
    avatar: "👨‍⚖️",
    content: "Advocate Prashant Jha sir explains case laws with practical courtroom examples. Best legal learning platform for competitive exam preparation!",
    rating: 5,
    course: "Indian Evidence Act"
  },
  {
    id: 5,
    name: "Neha Verma",
    role: "CLAT Aspirant",
    avatar: "👩‍💼",
    content: "The subject-wise notes and revision charts are extremely helpful! Made my exam revision so fast and easy.",
    rating: 5,
    course: "Revision Books"
  },
  {
    id: 6,
    name: "Rohan Kapoor",
    role: "Advocate Junior",
    avatar: "⚖️",
    content: "Practical insights on drafting and writ petitions that university classes never cover. Highly recommended for every law student!",
    rating: 5,
    course: "Legal Drafting"
  }
];

const Reviews = () => {
  return (
    <section className="reviews-section">
      <div className="container">
        <div className="reviews-header">
          <span className="reviews-badge">⭐ Student Testimonials</span>
          <h2 className="reviews-title">What Our Students Say</h2>
          <p className="reviews-sub">Join 30,000+ law students and aspirants learning law the simple way</p>
        </div>

        {/* Show ALL reviews in a responsive 3-column grid */}
        <div className="reviews-grid">
          {REVIEWS_DATA.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card-top">
                <div className="review-avatar">{review.avatar}</div>
                <div>
                  <h4 className="review-author">{review.name}</h4>
                  <span className="review-role">{review.role}</span>
                </div>
                <div className="review-rating">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
              </div>

              <p className="review-text">"{review.content}"</p>

              <div className="review-card-footer">
                <span className="review-course-badge">📚 {review.course}</span>
                <span className="verified-badge">✓ Verified Learner</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
