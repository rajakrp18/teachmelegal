"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import './InstructorProfile.css';

const InstructorProfile = () => {
  return (
    <section id="about" className="instructor-section">
      <div className="container">
        <div className="instructor-grid">
          {/* Left Column: Heading, Badge & Motto Quote Card */}
          <motion.div 
            className="instructor-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="capsule-badge-gold mb-3">ABOUT TEACHMELEGAL</span>
            
            <h2 className="instructor-main-heading">
              Built On Integrity,<br />
              Driven By Justice
            </h2>

            {/* Authentic Personal Quote / Motto Card (Human Touch) */}
            <div className="advocate-motto-card">
              <span className="quote-mark">“</span>
              <p className="motto-text">
                Law is not just codified text on paper; it is the living shield that protects human dignity and empowers everyday citizens.
              </p>
              <div className="motto-author">
                <strong>Adv. Prashant Jha</strong>
                <span>Supreme Court of India & High Court of Delhi</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio Narrative & Call-To-Action */}
          <motion.div 
            className="instructor-right"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="instructor-description">
              TeachMeLegal is an advocate-led legal education practice dedicated to making complex Indian jurisprudence crystal clear. Practicing before the <strong>Supreme Court of India</strong> and the <strong>High Court of Delhi</strong>, Advocate Prashant Jha combines strategic legal thinking with structured learning to empower students, legal professionals, and everyday citizens.
            </p>

            <p className="instructor-sub-description">
              Our approach is grounded in courtroom precision, exam accuracy, and a deep commitment to mastery—because your legal journey deserves more than rote memorization.
            </p>

            {/* Specialization Badges */}
            <div className="specialization-pills">
              <span className="spec-pill">⚖️ Constitutional Law</span>
              <span className="spec-pill">🏦 Banking Statutes</span>
              <span className="spec-pill">📜 Criminal Procedure</span>
              <span className="spec-pill">📑 Supreme Court Practice</span>
            </div>

            <div className="instructor-cta-row">
              <Link href="/about" className="btn btn-gold">
                <span>Learn More About Us</span>
                <span className="btn-arrow-icon">↗</span>
              </Link>

              <a 
                href="https://www.youtube.com/watch?v=hy5ji_1vu2M" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline"
              >
                ▶ Watch Free Lectures
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InstructorProfile;
