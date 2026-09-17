"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './BlogPreview.css';

const INITIAL_PREVIEW_POSTS = [
  {
    slug: 'state-bank-of-india-act-1955',
    category: 'Banking Law',
    categoryColor: '#3b82f6',
    title: 'State Bank of India Act, 1955',
    date: 'November 3, 2021',
    author: 'Advocate Prashant Jha',
    readTime: '5 min read',
    excerpt: "The State Bank of India Act, 1955 is a landmark legislation that governs the functioning of India's largest public sector bank.",
    icon: '🏛️'
  },
  {
    slug: 'right-of-set-off-in-banking',
    category: 'Banking Law',
    categoryColor: '#3b82f6',
    title: 'Right of Set-Off in Banking',
    date: 'October 16, 2021',
    author: 'Advocate Prashant Jha',
    readTime: '7 min read',
    excerpt: 'Right of Set-Off is a legal right of a creditor to collect what is owed to him by withholding payment of an amount owed to the debtor.',
    icon: '⚖️'
  },
  {
    slug: 'why-teachmelegal-journey-making-law-simple',
    category: 'Teachmelegal',
    categoryColor: '#c5a059',
    title: 'Why Teachmelegal? – The Journey of Making Law Simple',
    date: 'December 21, 2020',
    author: 'Advocate Prashant Jha',
    readTime: '4 min read',
    excerpt: 'Some time ago someone asked me why do people search for others to teach them? Because we taught ourselves. That motivated me to start Teachmelegal...',
    icon: '📖'
  },
];

const BlogPreview = () => {
  const [posts, setPosts] = useState(INITIAL_PREVIEW_POSTS);

  useEffect(() => {
    async function loadLatestPosts() {
      try {
        const res = await fetch('/api/admin/blogs');
        const data = await res.json();
        if (data.success && data.posts && data.posts.length > 0) {
          setPosts(data.posts.filter(p => p.published).slice(0, 3));
        }
      } catch (err) {
        // Fallback to initial preview posts if API unavailable
      }
    }
    loadLatestPosts();
  }, []);

  return (
    <section className="blog-preview-section">
      <div className="container">
        <div className="blog-preview-header">
          <div>
            <span className="blog-preview-badge">📝 From the Blog</span>
            <h2 className="blog-preview-title">Latest Legal Insights</h2>
            <p className="blog-preview-sub">Read practical legal analysis, case summaries, and exam guidance by Advocate Prashant Jha</p>
          </div>
          <Link href="/blog" className="btn btn-outline blog-preview-all-btn">
            View All Articles →
          </Link>
        </div>

        <div className="blog-preview-grid">
          {posts.map(post => (
            <article key={post.slug} className="blog-preview-card">
              <div className="blog-preview-card-top">
                <span className="blog-preview-cat-badge" style={{ background: post.categoryColor || '#3b82f6' }}>
                  {post.category}
                </span>
                <span className="blog-preview-readtime">⏱ {post.readTime || '5 min read'}</span>
              </div>

              <div className="blog-preview-body">
                <div className="blog-preview-meta">
                  <span>📅 {post.date}</span>
                  <span>👤 {post.author || 'Advocate Prashant Jha'}</span>
                </div>

                <Link href={`/blog/${post.slug}`} className="blog-preview-title-link">
                  <h3 className="blog-preview-post-title">{post.title}</h3>
                </Link>

                <p className="blog-preview-excerpt">{post.excerpt}</p>
              </div>

              <div className="blog-preview-footer">
                <Link href={`/blog/${post.slug}`} className="blog-preview-read-btn">
                  <span>Read Article</span>
                  <span className="arrow">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
