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
          <span className="capsule-badge-gold">⚖️ Advocate-Led Legal Education</span>
          <h1 className="about-hero-title">
            Demystifying Law With <span className="gold-text">Courtroom Precision</span>
          </h1>
          <p className="about-hero-subtitle">
            Founded by practicing Supreme Court Advocate Prashant Jha to bridge the gap between academic law textbooks and real-world judicial practice.
          </p>
        </div>
      </section>

      {/* Founder Personal Note & Profile */}
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
            </div>
          </div>

          <div className="about-text-col">
            <span className="section-subtitle">FOUNDER'S PERSONAL NOTE</span>
            <h2 className="about-heading">"Law Should Empower, Not Intimidate"</h2>
            
            <div className="founder-letter-card">
              <p className="founder-quote">
                "When I started TeachMeLegal during the 2020 lockdown, my goal was clear: strip away dense legal jargon and teach Indian law the way a practicing advocate applies it in court. Whether you are preparing for Judicial Services, university LL.B. exams, or simply standing up for your rights—you deserve clear, structured, and battle-tested guidance."
              </p>
              <div className="founder-signature-block">
                <strong>Advocate Prashant Jha</strong>
                <span>Supreme Court of India • High Court of Delhi</span>
              </div>
            </div>

            <div className="about-stats-grid">
              <div className="stat-card">
                <span className="stat-number">10+</span>
                <span className="stat-label">Years Legal Practice</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">30,000+</span>
                <span className="stat-label">Enrolled Students</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">95%</span>
                <span className="stat-label">Exam Pass Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The TeachMeLegal Advantage: Method Comparison */}
      <section className="about-method-section">
        <div className="container">
          <div className="center-header">
            <span className="section-subtitle">WHY OUR APPROACH WORKS</span>
            <h2 className="about-heading center">The TeachMeLegal Difference</h2>
            <p className="section-sub-desc center">How we transform traditional legal studying into intuitive courtroom mastery.</p>
          </div>

          <div className="method-comparison-grid">
            <div className="method-card traditional">
              <div className="method-badge text-muted">Traditional Legal Education</div>
              <ul className="method-list">
                <li>❌ Dense 800-page textbooks filled with archaic legalese</li>
                <li>❌ Pure academic theory disconnected from real courts</li>
                <li>❌ Unstructured notes leaving students overwhelmed</li>
                <li>❌ Rote memorization without understanding statutory intent</li>
              </ul>
            </div>

            <div className="method-card teachmelegal">
              <div className="method-badge text-gold">The TeachMeLegal Method</div>
              <ul className="method-list">
                <li>✨ Visual Article-by-Article revision charts & summaries</li>
                <li>✨ Real Supreme Court & High Court landmark case illustrations</li>
                <li>✨ Exam-tested answer writing frameworks for Judiciary & LL.B.</li>
                <li>✨ Direct practical insights from active courtroom litigation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="about-story-section">
        <div className="container">
          <div className="story-wrapper">
            <div className="story-header">
              <span className="story-icon">📜</span>
              <h2 className="about-heading center">Our Journey & Core Values</h2>
            </div>

            <div className="story-content">
              <p>
                What began as a popular YouTube legal initiative <strong>(formerly Lawyer Prashant)</strong> has grown into India's premier platform for concise law notes, judicial service exam materials, and structured video masterclasses.
              </p>
              <p>
                We believe that true legal education is built on <strong>integrity, clarity, and courtroom relevance</strong>. Every chart, video, and handbook released on TeachMeLegal undergoes meticulous review to ensure 100% statutory accuracy.
              </p>
            </div>

            {/* Mission & Vision Grid */}
            <div className="about-mv-grid">
              <div className="mv-card">
                <div className="mv-card-header">
                  <span className="mv-icon">🎯</span>
                  <h3 className="mv-title">Our Mission</h3>
                </div>
                <p className="mv-text">
                  To provide accessible, high-yield legal education that empowers judicial aspirants, law students, and everyday citizens with practical courtroom confidence.
                </p>
              </div>

              <div className="mv-card">
                <div className="mv-card-header">
                  <span className="mv-icon">🔭</span>
                  <h3 className="mv-title">Our Vision</h3>
                </div>
                <p className="mv-text">
                  To become India's most trusted legal portal — setting the benchmark for simplified, authoritative jurisprudence education across the nation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discount CTA Banner */}
      <section className="discount-cta-banner">
        <div className="container discount-cta-inner">
          <div className="cta-content">
            <span className="capsule-badge-gold">🔥 SPECIAL LEARNER OFFER</span>
            <h2 className="cta-title">Start Your Legal Mastery Today</h2>
            <p className="cta-subtitle">Explore our structured video courses and subject-wise exam charts curated by Advocate Prashant Jha.</p>
          </div>
          <Link href="/courses" className="btn btn-gold hero-cta-btn">
            <span>Explore All Courses</span>
            <span className="btn-arrow-icon">↗</span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
