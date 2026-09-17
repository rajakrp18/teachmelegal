import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BlogList from '../../components/BlogList';
import './blog.css';

export const metadata = {
  title: 'Legal Blog | Teach Me Legal',
  description: 'Read legal insights, articles, and analysis by Advocate Prashant Jha.',
};

export default function BlogPage() {
  return (
    <main>
      <Navbar />
      <section className="blog-hero">
        <div className="container">
          <h1 className="blog-hero-title">Blog</h1>
        </div>
      </section>
      <BlogList />
      <Footer />
    </main>
  );
}
