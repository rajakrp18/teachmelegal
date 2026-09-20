"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './BlogPreview.css';

const INITIAL_PREVIEW_POSTS = [
  {
    slug: 'state-bank-of-india-act-1955',
    category: 'BANKING LAW',
    title: 'State Bank of India Act, 1955 — Banking Governance & Law',
    date: 'NOV 2021',
    author: 'Advocate Prashant Jha',
  },
  {
    slug: 'right-of-set-off-in-banking',
    category: 'BANKING LAW',
    title: 'Right of Set-Off in Banking: Statutory & Common Law Principles',
    date: 'OCT 2021',
    author: 'Advocate Prashant Jha',
  },
  {
    slug: 'why-teachmelegal-journey-making-law-simple',
    category: 'LEGAL EDUCATION',
    title: 'Why Teachmelegal? – The Journey of Making Law Accessible',
    date: 'DEC 2020',
    author: 'Advocate Prashant Jha',
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
          const mapped = data.posts.slice(0, 4).map(p => ({
            slug: p.slug,
            category: (p.category || 'LEGAL ARTICLE').toUpperCase(),
            title: p.title,
            date: p.date || 'NOV 2021',
            author: p.author || 'Advocate Prashant Jha'
          }));
          setPosts(mapped);
        }
      } catch (err) {
        // Fallback to static initial preview posts
      }
    }
    loadLatestPosts();
  }, []);

  return (
    <section className="legal-works-section">
      <div className="container">
        {/* Header Row */}
        <div className="works-header-row">
          <div>
            <span className="capsule-badge-outline mb-3">THE WORKS I AM PROUD OF</span>
            <h2 className="works-title">Some Of My Legal Works</h2>
          </div>

          <div className="works-header-right">
            <p className="works-sub">
              Explore a curated selection of legal articles, case analyses, and landmark statute guides written by Advocate Prashant Jha.
            </p>
            <Link href="/blog" className="btn btn-gold">
              <span>See All Articles</span>
              <span className="btn-arrow-icon">↗</span>
            </Link>
          </div>
        </div>

        {/* Minimalist Works Table */}
        <div className="works-table-wrapper">
          <div className="works-table-header">
            <span className="col-title">Title</span>
            <span className="col-category">Category</span>
            <span className="col-date">Date</span>
            <span className="col-action">Action</span>
          </div>

          <div className="works-table-body">
            {posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="works-table-row">
                <div className="row-cell-title">
                  <h3>{post.title}</h3>
                </div>

                <div className="row-cell-category">
                  <span className="cat-capsule">{post.category}</span>
                </div>

                <div className="row-cell-date">
                  <span>{post.date}</span>
                </div>

                <div className="row-cell-action">
                  <span className="row-arrow-circle">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
