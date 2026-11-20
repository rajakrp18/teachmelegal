"use client";
import React from 'react';
import { IconStar, IconBookOpen, IconCheck } from './Icons';
import './Reviews.css';

const REVIEWS_DATA = [
  {
    id: 1,
    name: "Priyanka Kashyap",
    role: "LL.B Scholar • Delhi University",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    content: "What an Explanation!! Exceptionally good. Thank you so much sir. Tomorrow is my exam and just like many others I was overwhelmed, but your structured notes made every concept clear.",
    rating: 5,
    course: "Constitutional Law"
  },
  {
    id: 2,
    name: "Shruti Sharma",
    role: "Judicial Services Aspirant",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300",
    content: "Thank you so much Prashant Sir. Jiski kitaab dekhne ka mann tak nahi karta usko aapne mere liye ekdam asaan kar diya. The statutory charts are pure gold for judiciary preparation.",
    rating: 5,
    course: "Banking & Financial Law"
  },
  {
    id: 3,
    name: "Anand Kashyap",
    role: "Law Student • 4th Year",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
    content: "Sir I am a law student. I am really thankful to you sir for making complex legal history and IPC concepts so intuitive. It has been invaluable for me and my batchmates.",
    rating: 5,
    course: "Legal History & Jurisprudence"
  },
  {
    id: 4,
    name: "Vikramaditya Singh",
    role: "Judiciary Aspirant • UP PCS-J",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    content: "Advocate Prashant Jha sir explains case laws with real courtroom litigation examples. The best, most authoritative legal learning platform for competitive exam prep!",
    rating: 5,
    course: "Indian Evidence Act"
  },
  {
    id: 5,
    name: "Neha Verma",
    role: "CLAT PG Rankholder",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    content: "The subject-wise notes and revision charts are extremely helpful! Made my last-minute exam revision incredibly rapid and structured.",
    rating: 5,
    course: "Criminal Major Acts"
  },
  {
    id: 6,
    name: "Rohan Kapoor",
    role: "Junior Advocate • High Court",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300",
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
                <div className="review-avatar">
                  <img 
                    src={review.image} 
                    alt={review.name} 
                    className="review-avatar-img"
                    loading="lazy"
                  />
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
