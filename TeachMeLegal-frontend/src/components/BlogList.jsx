"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import LegalGlossary from './LegalGlossary';
import { IconScales, IconCalendar, IconClock, IconArrowUpRight, IconSearch, IconLightbulb, IconBookOpen } from './Icons';
import './BlogList.css';

const DEFAULT_POSTS = [
  {
    slug: "state-bank-of-india-act-1955",
    category: "Banking Law",
    categoryColor: "rgba(207, 168, 86, 0.15)",
    title: "State Bank of India Act, 1955 — Governance & Regulatory Framework",
    author: "Adv. Prashant Jha",
    date: "November 1, 2025",
    comments: 0,
    excerpt: "Comprehensive analysis of the State Bank of India Act 1955, examining statutory provisions, Imperial Bank transition, and banking governance rules.",
    readTime: "8 min read"
  },
  {
    slug: "right-of-set-off-in-banking",
    category: "Banking Law",
    categoryColor: "rgba(207, 168, 86, 0.15)",
    title: "Right of Set-Off in Banking Law: Statutory & Common Law Principles",
    author: "Adv. Prashant Jha",
    date: "October 25, 2025",
    comments: 0,
    excerpt: "Detailed guide on the banker's right of set-off under Indian banking jurisprudence, mutuality of debt, and notice requirements.",
    readTime: "6 min read"
  },
  {
    slug: "garnishee-orders-in-banking",
    category: "Banking Law",
    categoryColor: "rgba(207, 168, 86, 0.15)",
    title: "Garnishee Orders in Banking: Court Procedure & Bank Duties",
    author: "Adv. Prashant Jha",
    date: "October 23, 2025",
    comments: 0,
    excerpt: "Understanding Garnishee Orders Order 21 Rule 46 CPC, attachment of bank accounts, judgment debtor obligations, and banker liabilities.",
    readTime: "5 min read"
  },
  {
    slug: "mareva-injunction",
    category: "Banking Law",
    categoryColor: "rgba(207, 168, 86, 0.15)",
    title: "Mareva Injunction: Freezing Orders in Indian Commercial Litigation",
    author: "Adv. Prashant Jha",
    date: "October 22, 2025",
    comments: 0,
    excerpt: "Examine Mareva injunctions, asset freezing orders under Order 39 CPC, preventing asset dissipation, and high court precedents.",
    readTime: "7 min read"
  },
  {
    slug: "introduction-to-banking-law",
    category: "Banking Law",
    categoryColor: "rgba(207, 168, 86, 0.15)",
    title: "Introduction to Indian Banking Law & RBI Regulatory Powers",
    author: "Adv. Prashant Jha",
    date: "September 21, 2025",
    comments: 0,
    excerpt: "Essential introduction to Banking Regulation Act 1949, RBI Act 1934, licensing, capital requirements, and banker-customer relationship.",
    readTime: "9 min read"
  },
  {
    slug: "why-teachmelegal-the-journey-of-making-law-simple",
    category: "Teachmelegal",
    categoryColor: "rgba(207, 168, 86, 0.15)",
    title: "Why Teachmelegal? – The Journey Of Making Law Simple",
    author: "Prashant Jha",
    date: "September 21, 2025",
    comments: 0,
    excerpt: "Advocate Prashant Jha shares the story behind TeachMeLegal — bridging courtroom practice and student education with simplified visual guides.",
    readTime: "5 min read"
  }
];

const POPULAR_TAGS = ['Banking Law', 'Judicial Services', 'Section 138', 'Constitutional Writs', 'Supreme Court'];

const BlogList = ({ initialPosts = [] }) => {
  const [posts, setPosts] = useState(initialPosts && initialPosts.length > 0 ? initialPosts : DEFAULT_POSTS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (data.success && data.posts && data.posts.length > 0) {
          setPosts(data.posts.filter(p => p.published !== false));
        }
      } catch (err) {
        // Fallback to loaded posts
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
      (post.excerpt && post.excerpt.toLowerCase().includes(selectedTag.toLowerCase()));
    return matchesCategory && matchesTag && matchesSearch;
  });

  return (
    <section className="bloglist-section">
      <div className="container bloglist-layout">

        {/* Main Content */}
        <div className="blog-main">
          {filtered.length === 0 && (
            <div className="blog-empty">
              <p>No articles found matching your criteria. Try resetting filters.</p>
            </div>
          )}

          {filtered.map(post => (
            <article key={post.slug} className="blog-card">
              <div className="blog-card-category-bar">
                <span className="blog-cat-pill">{post.category}</span>
              </div>
              <div className="blog-card-body">
                <Link href={`/blog/${post.slug}`} className="blog-card-title-link">
                  <h2 className="blog-card-title">{post.title}</h2>
                </Link>
                <div className="blog-card-meta">
                  <span className="meta-item">
                    <IconScales size={14} className="meta-svg" />
                    {post.author || 'Adv. Prashant Jha'}
                  </span>
                  <span className="meta-item">
                    <IconCalendar size={14} className="meta-svg" />
                    {post.date}
                  </span>
                  <span className="meta-item">
                    <IconClock size={14} className="meta-svg" />
                    {post.readTime || '5 min read'}
                  </span>
                </div>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="btn btn-gold btn-sm">
                  <span>Read Full Article</span>
                  <span className="btn-arrow-icon">
                    <IconArrowUpRight size={12} />
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="blog-sidebar">

          {/* Search */}
          <div className="sidebar-widget">
            <h3 className="sidebar-title">Search Articles</h3>
            <div className="sidebar-search">
              <input
                type="text"
                placeholder="Search legal topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sidebar-search-input"
              />
              <button className="sidebar-search-btn" aria-label="Search">
                <IconSearch size={15} />
              </button>
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
            <h3 className="sidebar-title">Recent Articles</h3>
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
            <h3 className="sidebar-title">
              <IconBookOpen size={18} style={{ color: 'var(--accent-gold)' }} />
              Legal Terms & Maxims
            </h3>
            <p className="glossary-widget-subtitle">
              Hover over terms for statutory definitions and courtroom applications.
            </p>
            <div className="glossary-items-list">
              <LegalGlossary termKey="mens rea" />
              <LegalGlossary termKey="sub judice" />
              <LegalGlossary termKey="estoppel" />
              <LegalGlossary termKey="habeas corpus" />
            </div>
          </div>

        </aside>
      </div>
    </section>
  );
};

export default BlogList;
