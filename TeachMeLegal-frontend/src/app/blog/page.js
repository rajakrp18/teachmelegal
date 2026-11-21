import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BlogList from '../../components/BlogList';
import { IconScales } from '../../components/Icons';
import { getAllPosts } from '../../lib/blogsStore';
import './blog.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Legal Blog & Articles | Teach Me Legal',
  description: 'Read legal insights, landmark case analyses, and statutory guides by Advocate Prashant Jha.',
};

export default async function BlogPage() {
  let posts = getAllPosts(false);

  // Sync from admin backend on Vercel if deployed
  const adminUrl = process.env.ADMIN_BACKEND_URL || 'https://teachmelegal-teach-me-legal-admin-p.vercel.app';
  if (adminUrl && !adminUrl.includes('localhost')) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`${adminUrl}/api/blogs`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          const idMap = new Map();
          posts.forEach(p => idMap.set(p.id || p.slug, p));
          data.posts.forEach(p => idMap.set(p.id || p.slug, p));
          posts = Array.from(idMap.values());
        }
      }
    } catch (e) {}
  }

  return (
    <main className="blog-page-wrapper">
      <Navbar />
      <section className="blog-hero">
        <div className="container blog-hero-container">
          <span className="capsule-badge-gold mb-3">
            <span className="badge-icon"><IconScales size={14} /></span>
            COURTROOM INSIGHTS & JURISPRUDENCE
          </span>
          <h1 className="blog-hero-title">
            Legal <span className="gold-text">Articles & Case Studies</span>
          </h1>
          <p className="blog-hero-subtitle">
            Statutory breakdowns, landmark Supreme Court judgment analyses, and practical exam notes written by Advocate Prashant Jha.
          </p>
        </div>
      </section>
      <BlogList initialPosts={posts} />
      <Footer />
    </main>
  );
}
