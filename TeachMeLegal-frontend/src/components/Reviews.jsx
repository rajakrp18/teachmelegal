"use client";
import React from 'react';
import { IconStar, IconBookOpen, IconCheck } from './Icons';
import './Reviews.css';

const REVIEWS_DATA = [
  {
    id: 1,
    name: "Priyanka Kashyap",
    initials: "PK",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    role: "LL.B Scholar • Delhi University",
    content: "What an Explanation!! Exceptionally good. Thank you so much sir. Tomorrow is my exam and just like many others I was overwhelmed, but your structured notes made every concept clear.",
    rating: 5,
    course: "Constitutional Law"
  },
  {
    id: 2,
    name: "Shruti Sharma",
    initials: "SS",
    gradient: "linear-gradient(135deg, #78350f 0%, #d97706 100%)",
    role: "Judicial Services Aspirant",
    content: "Thank you so much Prashant Sir. Jiski kitaab dekhne ka mann tak nahi karta usko aapne mere liye ekdam asaan kar diya. The statutory charts are pure gold for judiciary preparation.",
    rating: 5,
    course: "Banking & Financial Law"
  },
  {
    id: 3,
    name: "Anand Kashyap",
    initials: "AK",
    gradient: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
    role: "Law Student • 4th Year",
    content: "Sir I am a law student. I am really thankful to you sir for making complex legal history and IPC concepts so intuitive. It has been invaluable for me and my batchmates.",
    rating: 5,
    course: "Legal History & Jurisprudence"
  },
  {
    id: 4,
    name: "Vikramaditya Singh",
    initials: "VS",
    gradient: "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)",
    role: "Judiciary Aspirant • UP PCS-J",
    content: "Advocate Prashant Jha sir explains case laws with real courtroom litigation examples. The best, most authoritative legal learning platform for competitive exam prep!",
    rating: 5,
    course: "Indian Evidence Act"
  },
  {
    id: 5,
    name: "Neha Verma",
    initials: "NV",
    gradient: "linear-gradient(135deg, #831843 0%, #ec4899 100%)",
    role: "CLAT PG Rankholder",
    content: "The subject-wise notes and revision charts are extremely helpful! Made my last-minute exam revision incredibly rapid and structured.",
    rating: 5,
    course: "Criminal Major Acts"
  },
  {
    id: 6,
    name: "Rohan Kapoor",
    initials: "RK",
    gradient: "linear-gradient(135deg, #134e4a 0%, #14b8a6 100%)",
    role: "Junior Advocate • High Court",
    content: "Practical insights on drafting, bail jurisprudence, and writ petitions that university classes never cover. Essential training for every entering advocate!",
    rating: 5,
    course: "Courtroom Practice & Drafting"
  }
];

const Reviews = () => {
  return (
    <section className="reviews-section">
      <div className="container">
        <div className="reviews-header">
          <span className="capsule-badge-gold mb-3">
            <span className="badge-icon"><IconStar size={13} /></span>
            <span>VERIFIED STUDENT TESTIMONIALS</span>
          </span>
          <h2 className="reviews-title">What Our Students Say</h2>
          <p className="reviews-sub">Join 100,000+ law students, judicial aspirants, and advocates learning law with clarity</p>
        </div>

        {/* Show ALL reviews in a responsive 3-column grid */}
        <div className="reviews-grid">
          {REVIEWS_DATA.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card-top">
                <div 
                  className="review-avatar review-avatar-initials" 
                  style={{ background: review.gradient }}
                  aria-label={review.name}
                >
                  <span className="review-initials-text">{review.initials}</span>
                </div>
                <div>
                  <h4 className="review-author">{review.name}</h4>
                  <span className="review-role">{review.role}</span>
                </div>
                <div className="review-rating">
                  {[...Array(review.rating)].map((_, i) => (
                    <IconStar key={i} size={15} className="review-star-icon" />
                  ))}
                </div>
              </div>

              <p className="review-text">"{review.content}"</p>

              <div className="review-card-footer">
                <span className="review-course-badge">
                  <IconBookOpen size={14} />
                  <span>{review.course}</span>
                </span>
                <span className="verified-badge">
                  <IconCheck size={13} />
                  <span>Verified Learner</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
