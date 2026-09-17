"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import LegalGlossary from './LegalGlossary';
import './BlogList.css';

const DEFAULT_POSTS = [
  {
    slug: "state-bank-of-india-act-1955",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "State Bank of India Act, 1955",
    author: "Prashant Jha",
    date: "November 1, 2025",
    comments: 0,
    excerpt: "Objective of the Act to establish the State Bank of India (SBI) as a public sector banking institution by taking over the business of the Imperial Bank of India...",
    readTime: "8 min read"
  },
  {
    slug: "right-of-set-off-in-banking",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "RIGHT OF SET-OFF IN BANKING",
    author: "Prashant Jha",
    date: "October 25, 2025",
    comments: 0,
    excerpt: "RIGHT OF SET-OFF IN BANKING LAW 1. Meaning of Set-off In simple terms, Set-off means adjusting one debt against another...",
    readTime: "6 min read"
  },
  {
    slug: "garnishee-orders-in-banking",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "Garnishee Orders in Banking",
    author: "Prashant Jha",
    date: "October 23, 2025",
    comments: 0,
    excerpt: "Garnishee Orders in Banking 1. What is a Garnishee Order? A Garnishee Order is an order of a court directing a third person...",
    readTime: "5 min read"
  },
  {
    slug: "mareva-injunction",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "MAREVA INJUNCTION",
    author: "Prashant Jha",
    date: "October 22, 2025",
    comments: 0,
    excerpt: "MAREVA INJUNCTION 1. What is a Mareva Injunction? A Mareva Injunction is an interim court order that restrains a defendant...",
    readTime: "7 min read"
  },
  {
    slug: "introduction-to-banking-law",
    category: "Banking Law",
    categoryColor: "#3b82f6",
    title: "INTRODUCTION TO BANKING LAW",
    author: "Prashant Jha",
    date: "September 21, 2025",
    comments: 0,
    excerpt: "1. Nature, Scope, and Functions of Banking Law Banking law is a set of legal rules and regulations that control how banks operate...",
    readTime: "9 min read"
  },
  {
    slug: "why-teachmelegal-journey-making-law-simple",
    category: "Teachmelegal",
    categoryColor: "#c5a059",
    title: "Why Teachmelegal? – The Journey of Making Law Simple",
    author: "Prashant Jha",
    date: "September 21, 2025",
    comments: 0,
    excerpt: "When I started my legal career, one thing became very clear to me—law is often taught in a way that feels complicated and disconnected from real life...",
    readTime: "5 min read"
  }
];

const POPULAR_TAGS = ['banking', 'bankinglaw', 'banking law in India', 'law', 'Teachmelegal'];

const BlogList = () => {
  const [posts, setPosts] = useState(DEFAULT_POSTS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/admin/blogs');
        const data = await res.json();
        if (data.success && data.posts && data.posts.length > 0) {
          setPosts(data.posts.filter(p => p.published));
        }
      } catch (err) {
        console.error('Failed to load published posts:', err);
      }
    }
    loadBlogs();
  }, []);

  const categories = useMemo(() => {
    const counts = {};
    posts.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.keys(counts).map(cat => ({ name: cat, count: counts[cat] }));
  }, [posts]);

  const filtered = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesTag = !selectedTag ||
      post.title.toLowerCase().includes(selectedTag.toLowerCase()) ||
      post.category.toLowerCase().includes(selectedTag.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(selectedTag.toLowerCase()));
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesTag && matchesSearch;
  });

  return (
    <section className="bloglist-section">
      <div className="container bloglist-layout">

        {/* Main Content */}
        <div className="blog-main">
          {filtered.length === 0 && (
            <div className="blog-empty">
              <p>No posts found for your search. Try a different keyword.</p>
            </div>
          )}

          {filtered.map(post => (
            <article key={post.slug} className="blog-card">
              <div className="blog-card-category-bar" style={{ background: post.categoryColor || '#3b82f6' }}>
                <span>{post.category}</span>
              </div>
              <div className="blog-card-body">
                <Link href={`/blog/${post.slug}`} className="blog-card-title-link">
                  <h2 className="blog-card-title">{post.title}</h2>
                </Link>
                <div className="blog-card-meta">
                  <span className="meta-item">👤 {post.author}</span>
                  <span className="meta-item">📅 {post.date}</span>
                  <span className="meta-item">💬 {post.comments || 0} Comments</span>
                  <span className="meta-item">⏱ {post.readTime || '5 min read'}</span>
                </div>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="blog-continue-btn">
                  Continue Reading →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="blog-sidebar">

          {/* Search */}
          <div className="sidebar-widget">
            <div className="sidebar-search">
              <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sidebar-search-input"
              />
              <button className="sidebar-search-btn" aria-label="Search">🔍</button>
            </div>
          </div>

          {/* Categories */}
          <div className="sidebar-widget">
            <h3 className="sidebar-title">Categories</h3>
            <ul className="sidebar-category-list">
              <li>
                <button
                  className={`sidebar-cat-btn ${activeCategory === 'All' ? 'active' : ''}`}
                  onClick={() => { setActiveCategory('All'); setSelectedTag(null); }}
                >
                  <span>All Categories</span>
                  <span className="cat-count">{posts.length}</span>
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.name}>
                  <button
                    className={`sidebar-cat-btn ${activeCategory === cat.name ? 'active' : ''}`}
                    onClick={() => { setActiveCategory(cat.name); setSelectedTag(null); }}
                  >
                    <span>{cat.name}</span>
                    <span className="cat-count">{cat.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Posts */}
          <div className="sidebar-widget">
            <h3 className="sidebar-title">Recent Posts</h3>
            <ul className="recent-posts-list">
              {posts.slice(0, 5).map(post => (
                <li key={post.slug} className="recent-post-item">
                  <Link href={`/blog/${post.slug}`} className="recent-post-link">
                    <span className="recent-post-title">{post.title}</span>
                    <span className="recent-post-date">{post.date}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tags */}
          <div className="sidebar-widget">
            <h3 className="sidebar-title">Popular Tags</h3>
            <div className="tags-cloud">
              {POPULAR_TAGS.map(tag => (
                <button
                  key={tag}
                  className={`tag-chip ${selectedTag === tag ? 'active-tag' : ''}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Legal Glossary */}
          <div className="sidebar-widget">
            <h3 className="sidebar-title">💡 Instant Legal Glossary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div>Hover to define: <LegalGlossary termKey="mens rea">Mens Rea</LegalGlossary></div>
              <div>Hover to define: <LegalGlossary termKey="sub judice">Sub Judice</LegalGlossary></div>
              <div>Hover to define: <LegalGlossary termKey="estoppel">Estoppel</LegalGlossary></div>
              <div>Hover to define: <LegalGlossary termKey="habeas corpus">Habeas Corpus</LegalGlossary></div>
            </div>
          </div>

        </aside>
      </div>
    </section>
  );
};

export default BlogList;
