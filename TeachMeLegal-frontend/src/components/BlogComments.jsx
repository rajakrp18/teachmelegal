"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './BlogComments.css';

export default function BlogComments({ post }) {
  const slug = post?.slug || 'general';
  const postTitle = post?.title || 'TeachMeLegal Article';
  
  // Default tags if post does not have tags
  const tags = post?.tags || [
    post?.category?.toLowerCase() || 'law',
    `${post?.category?.toLowerCase() || 'law'} in india`,
    post?.slug?.replace(/-/g, ' ') || 'legal study'
  ];

  // Social share links
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(postTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&description=${encodeURIComponent(postTitle)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(postTitle + ' ' + currentUrl)}`
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Comments state with localStorage persistence
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    website: '',
    comment: '',
    saveInfo: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // Load existing comments from localStorage
    try {
      const storageKey = `tml_comments_${slug}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setComments(JSON.parse(saved));
      } else {
        // Initial sample comments for realism
        const initialComments = [
          {
            id: 'c1',
            name: 'Aarav Mehta',
            initials: 'AM',
            date: '2 days ago',
            comment: 'Extremely detailed explanation of the statutory provisions! The chapter-wise breakdown and comparison tables make this topic so much easier to revise for the Judiciary exam.',
          },
          {
            id: 'c2',
            name: 'Pooja Deshmukh',
            initials: 'PD',
            date: 'Yesterday',
            comment: 'Thank you Advocate Prashant Jha Sir. This is by far the most structured legal note available online for Indian Banking Law.',
          }
        ];
        setComments(initialComments);
      }

      // Load saved user info
      const savedUser = localStorage.getItem('tml_user_info');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setForm(prev => ({ ...prev, name: u.name || '', email: u.email || '', website: u.website || '' }));
      }
    } catch {
      // localStorage may fail in some environments
    }
  }, [slug]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.comment.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newComment = {
        id: 'c_' + Date.now(),
        name: form.name.trim(),
        initials: form.name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U',
        date: 'Just now',
        comment: form.comment.trim(),
      };

      const updated = [newComment, ...comments];
      setComments(updated);

      try {
        localStorage.setItem(`tml_comments_${slug}`, JSON.stringify(updated));
        if (form.saveInfo) {
          localStorage.setItem('tml_user_info', JSON.stringify({
            name: form.name,
            email: form.email,
            website: form.website
          }));
        }
      } catch {}

      setForm(prev => ({ ...prev, comment: '' }));
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="blog-footer-interactions">
      {/* 1. Tags and Social Share Bar */}
      <div className="blog-meta-footer-bar">
        {/* Tags */}
        <div className="blog-tags-container">
          <span className="blog-tags-label">Tags :</span>
          <div className="blog-tags-list">
            {tags.map((tag, idx) => (
              <span key={idx} className="blog-tag-pill">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Social Share */}
        <div className="blog-share-container">
          <span className="blog-share-label">Social Share :</span>
          <div className="blog-share-icons">
            {/* Facebook */}
            <a 
              href={shareUrls.facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn facebook" 
              title="Share on Facebook"
              aria-label="Share on Facebook"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Twitter / X */}
            <a 
              href={shareUrls.twitter} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn twitter" 
              title="Share on X (Twitter)"
              aria-label="Share on X"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a 
              href={shareUrls.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn linkedin" 
              title="Share on LinkedIn"
              aria-label="Share on LinkedIn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            {/* Pinterest */}
            <a 
              href={shareUrls.pinterest} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn pinterest" 
              title="Share on Pinterest"
              aria-label="Share on Pinterest"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a 
              href={shareUrls.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn whatsapp" 
              title="Share on WhatsApp"
              aria-label="Share on WhatsApp"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.507 14.307l-.009.075c-.238-.12-1.406-.694-1.624-.774-.219-.08-.378-.12-.538.12-.16.24-.617.774-.757.934-.14.16-.279.18-.517.06-.239-.12-1.008-.372-1.92-1.185-.709-.633-1.188-1.415-1.328-1.655-.14-.24-.015-.369.105-.489.108-.108.239-.279.359-.419.12-.14.16-.239.24-.399.08-.16.04-.3-.02-.419-.06-.12-.538-1.298-.738-1.777-.194-.467-.393-.404-.538-.412l-.459-.008c-.16 0-.419.06-.638.3-.219.24-.838.819-.838 1.997 0 1.178.858 2.316.978 2.476.12.16 1.688 2.576 4.089 3.613.571.246 1.017.394 1.364.505.574.183 1.096.157 1.509.095.46-.069 1.406-.575 1.605-1.13.199-.554.199-1.029.14-1.13-.06-.1-.219-.16-.458-.28zM12.02 20c-1.579 0-3.07-.442-4.35-1.21l-.312-.186-3.23.847.862-3.149-.204-.324C4.12 14.639 3.65 13.014 3.65 11.35c0-4.615 3.755-8.37 8.37-8.37 2.235 0 4.337.87 5.918 2.45 1.58 1.58 2.45 3.682 2.45 5.92 0 4.615-3.755 8.37-8.37 8.37zm7.09-15.46C17.21 2.64 14.71 1.65 12.02 1.65 6.66 1.65 2.3 6.01 2.3 11.35c0 1.83.51 3.56 1.41 5.07L2 22l5.74-1.5c1.46.8 3.1 1.22 4.28 1.22 5.36 0 9.72-4.36 9.72-9.7 0-2.59-1.01-5.02-2.85-6.86z"/>
              </svg>
            </a>

            {/* Copy Link */}
            <button 
              onClick={handleCopyLink} 
              className={`social-btn copy-link ${copied ? 'copied' : ''}`}
              title="Copy Article Link"
              aria-label="Copy link"
            >
              {copied ? (
                <span className="copy-tooltip">✓ Copied!</span>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <hr className="blog-footer-divider" />

      {/* 2. Existing Comments */}
      {comments.length > 0 && (
        <div className="blog-existing-comments">
          <h3 className="comments-heading">
            Discussion & Insights <span className="comment-count-badge">({comments.length})</span>
          </h3>
          <div className="comments-list">
            {comments.map((c) => (
              <div key={c.id} className="comment-item">
                <div className="comment-avatar">{c.initials}</div>
                <div className="comment-body">
                  <div className="comment-header">
                    <strong className="comment-author">{c.name}</strong>
                    <span className="comment-date">{c.date}</span>
                  </div>
                  <p className="comment-text">{c.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Leave a Reply Section */}
      <div className="blog-reply-card">
        <h3 className="reply-title">Leave A Reply</h3>
        <p className="reply-notice">
          Your email address will not be published. Required fields are marked <span className="required-star">*</span>
        </p>

        {submitSuccess && (
          <div className="reply-success-alert">
            ✓ Thank you! Your comment has been posted and will appear in the discussion.
          </div>
        )}

        <form onSubmit={handleSubmit} className="reply-form">
          <div className="reply-form-row two-cols">
            <div className="reply-input-group">
              <input
                type="text"
                placeholder="Enter Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="reply-input"
              />
            </div>
            <div className="reply-input-group">
              <input
                type="email"
                placeholder="Enter Email *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="reply-input"
              />
            </div>
          </div>

          <div className="reply-form-row single-col">
            <div className="reply-input-group">
              <input
                type="url"
                placeholder="Enter Website"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="reply-input"
              />
            </div>
          </div>

          <div className="reply-form-row single-col">
            <div className="reply-input-group">
              <textarea
                placeholder="Enter Your Comment *"
                rows={6}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                required
                className="reply-textarea"
              ></textarea>
            </div>
          </div>

          <div className="reply-checkbox-row">
            <label className="reply-checkbox-label">
              <input
                type="checkbox"
                checked={form.saveInfo}
                onChange={(e) => setForm({ ...form, saveInfo: e.target.checked })}
                className="reply-checkbox"
              />
              <span>Save my name, email, and website in this browser for the next time I comment.</span>
            </label>
          </div>

          <div className="reply-submit-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-post-comment"
            >
              {isSubmitting ? 'POSTING...' : 'POST COMMENT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
