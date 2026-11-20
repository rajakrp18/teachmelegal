import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BlogList from '../../components/BlogList';
import { IconScales } from '../../components/Icons';
import './blog.css';

export const metadata = {
  title: 'Legal Blog & Articles | Teach Me Legal',
  description: 'Read legal insights, landmark case analyses, and statutory guides by Advocate Prashant Jha.',
};

export default function BlogPage() {
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
      <BlogList />
      <Footer />
    </main>
  );
}
