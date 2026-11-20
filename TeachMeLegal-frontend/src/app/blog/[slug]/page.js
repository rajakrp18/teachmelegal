import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '../../../lib/blogsStore';
import { IconUser, IconCalendar, IconClock, IconEye, IconScales, IconBookOpen, IconDocument } from '../../../components/Icons';
import BlogComments from '@/components/BlogComments';
import ViewTracker from '@/components/ViewTracker';
import './post.css';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  const posts = getAllPosts(true);
  const params = [];
  const added = new Set();

  for (const post of posts) {
    if (post.slug && !added.has(post.slug)) {
      params.push({ slug: post.slug });
      added.add(post.slug);
    }
    if (post.id === 'post-6' || post.slug.includes('why-teachmelegal')) {
      const alias1 = 'why-teachmelegal-the-journey-of-making-law-simple';
      const alias2 = 'why-teachmelegal-journey-making-law-simple';
      if (!added.has(alias1)) { params.push({ slug: alias1 }); added.add(alias1); }
      if (!added.has(alias2)) { params.push({ slug: alias2 }); added.add(alias2); }
    }
  }

  return params;
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <main>
        <Navbar />
        <div className="post-not-found" style={{ textAlign: 'center', padding: '120px 20px' }}>
          <h1>Post Not Found</h1>
          <p style={{ margin: '20px 0', color: '#64748b' }}>The article you are looking for does not exist or has been removed.</p>
          <Link href="/blog" className="btn btn-primary">← Back to All Articles</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <ViewTracker slug={post.slug} />

      <section className="post-hero" style={{ background: `linear-gradient(135deg, ${post.categoryColor || '#3b82f6'}22 0%, var(--primary-navy) 100%)` }}>
        <div className="container">
          <span className="post-category-badge" style={{ background: post.categoryColor || '#3b82f6' }}>{post.category}</span>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <IconUser size={14} style={{ color: 'var(--accent-gold)' }} />
              {post.author}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <IconCalendar size={14} style={{ color: 'var(--accent-gold)' }} />
              {post.date}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <IconClock size={14} style={{ color: 'var(--accent-gold)' }} />
              {post.readTime}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <IconEye size={14} style={{ color: 'var(--accent-gold)' }} />
              {post.views || 0} Views
            </span>
          </div>
        </div>
      </section>

      <section className="post-body-section">
        <div className="container post-body-layout">
          <div className="post-main-column">
            <article className="post-content prose" dangerouslySetInnerHTML={{ __html: post.content }} />
            <BlogComments post={post} />
          </div>

          <aside className="post-sidebar">
            <div className="post-sidebar-widget">
              <h3>About the Author</h3>
              <div className="author-card">
                <div className="author-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconScales size={24} style={{ color: 'var(--accent-gold)' }} />
                </div>
                <div>
                  <strong>{post.author}</strong>
                  <p>Practicing lawyer at the Supreme Court of India & Founder of Teach Me Legal.</p>
                </div>
              </div>
            </div>

            <div className="post-sidebar-widget">
              <h3>Explore More</h3>
              <ul className="post-nav-links">
                <li><Link href="/courses" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconBookOpen size={16} /> Courses</Link></li>
                <li><Link href="/books" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconBookOpen size={16} /> Books & Notes</Link></li>
                <li><Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><IconDocument size={16} /> All Blog Posts</Link></li>
              </ul>
            </div>

            <div className="post-cta-widget">
              <h3>Get 10% Off</h3>
              <p>Purchase 3+ Subject-wise Notes and get an instant discount!</p>
              <Link href="/books" className="btn btn-secondary">Browse Notes</Link>
            </div>
          </aside>
        </div>

        <div className="container">
          <Link href="/blog" className="post-back-link">← Back to All Posts</Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
