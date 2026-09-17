import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './about.css';

export const metadata = {
  title: 'About Us | Teach Me Legal',
  description: "India's Premier Legal Learning Platform by Advocate Prashant Jha",
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <Navbar />

      {/* Hero Banner */}
      <section className="about-hero">
        <div className="about-hero-bg" aria-hidden="true" />
        <div className="container about-hero-container">
          <span className="about-badge">⚖️ Who We Are</span>
          <h1 className="about-hero-title">
            India's Premier <span className="gold-text">Legal Learning</span> Platform
          </h1>
          <p className="about-hero-subtitle">
            Bridging the gap between academic legal education and real courtroom practice through simplified notes, structured courses, and expert insights.
          </p>
        </div>
      </section>

      {/* Intro Section - Founder Profile */}
      <section className="about-intro-section">
        <div className="container about-intro-grid">
          <div className="about-image-col">
            <div className="about-photo-card">
              <Image
                src="/prashant-jha.jpg"
                alt="Advocate Prashant Jha at Supreme Court of India"
                width={480}
                height={580}
                className="about-photo"
                priority
              />
              <div className="about-court-badge">
                <span className="badge-icon">🏛️</span>
                <div>
                  <strong>Advocate Prashant Jha</strong>
                  <span>Supreme Court of India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="about-text-col">
            <span className="section-subtitle">FOUNDER & INSTRUCTOR</span>
            <h2 className="about-heading">Transforming Legal Education Across India</h2>
            
            <p className="about-lead">
              Teachmelegal is a premier educational initiative founded by <strong>Advocate Prashant Jha</strong>, a practicing lawyer dedicated to demystifying Indian law for students, judicial aspirants, and young legal professionals.
            </p>

            <p className="about-body">
              Advocate Prashant Jha regularly appears before the <strong>Supreme Court of India</strong>, the <strong>High Court of Delhi</strong>, District Courts, and various national Tribunals. He brings first-hand litigation experience into every lesson, translating complex statutory provisions into intuitive, structured study materials.
            </p>

            <div className="about-stats-grid">
              <div className="stat-card">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years Courtroom Experience</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">30,000+</span>
                <span className="stat-label">Enrolled Students</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">50+</span>
                <span className="stat-label">Subject Notes & Books</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-story-section">
        <div className="container">
          <div className="story-wrapper">
            <div className="story-header">
              <span className="story-icon">📖</span>
              <h2 className="about-heading center">Our Journey & Story</h2>
            </div>

            <div className="story-content">
              <p>
                Teachmelegal was founded during the <strong>2020 lockdown</strong>, when Advocate Prashant Jha noticed a glaring gap in online legal education: most available lectures were either overly academic, disconnected from real courtroom application, or lacked engaging teaching methodologies.
              </p>
              <p>
                Driven to make a difference, he pioneered a practical approach to teaching Indian law — utilizing visual revision charts, simplified statutory breakdowns, and case law summaries that help students master legal concepts effortlessly.
              </p>
              <p>
                What began as a popular YouTube channel <strong>(formerly Lawyer Prashant)</strong> has evolved into India's leading platform for concise law notes, judiciary preparation materials, and comprehensive online video courses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mv-section">
        <div className="container about-mv-grid">
          <div className="mv-card">
            <div className="mv-card-header">
              <span className="mv-icon">🎯</span>
              <h3 className="mv-title">Our Mission</h3>
            </div>
            <ul className="mv-list">
              <li>Make law easy, engaging, and practically applicable for every learner.</li>
              <li>Deliver top-tier, syllabus-aligned subject notes and video lectures.</li>
              <li>Bridge the gap between textbook law and real courtroom advocacy.</li>
              <li>Empower judicial and competitive exam aspirants with proven exam strategies.</li>
            </ul>
          </div>

          <div className="mv-card vision-card">
            <div className="mv-card-header">
              <span className="mv-icon">🔭</span>
              <h3 className="mv-title">Our Vision</h3>
            </div>
            <p className="mv-text">
              To become India's most trusted legal education portal — equipping students, judicial aspirants, and citizens with accessible legal knowledge that inspires confidence in academia and courtroom practice.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="about-offer-section">
        <div className="container">
          <div className="center-header">
            <span className="section-subtitle">PLATFORM FEATURES</span>
            <h2 className="about-heading center">What We Offer</h2>
          </div>

          <div className="offer-grid">
            {[
              { icon: '📝', title: 'Curated Study Notes', text: 'Meticulously crafted notes aligned with university LL.B. syllabi and competitive exams.' },
              { icon: '🎬', title: 'HD Video Lectures', text: 'In-depth conceptual breakdowns with practical real-world legal illustrations.' },
              { icon: '🏆', title: 'Judiciary & Exam Guidance', text: 'Proven strategies, previous year question banks, and revision charts.' },
              { icon: '🤝', title: 'Active Community', text: 'A vibrant nationwide network of 30,000+ law students and legal enthusiasts.' },
            ].map((item, i) => (
              <div key={i} className="offer-card">
                <div className="offer-icon-wrapper">{item.icon}</div>
                <h4 className="offer-title">{item.title}</h4>
                <p className="offer-desc">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discount Banner */}
      <section className="discount-cta-banner">
        <div className="container discount-cta-inner">
          <div className="cta-content">
            <span className="cta-badge">🔥 SPECIAL OFFER</span>
            <h2 className="cta-title">Get 10% Instant Discount</h2>
            <p className="cta-subtitle">Purchase any 3 or more Subject-wise Notes and get an instant 10% off at checkout!</p>
          </div>
          <Link href="/books" className="btn btn-secondary btn-lg">
            📚 Browse Notes & Books
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
