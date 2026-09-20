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
          {/* Left Column: Heading & Tag */}
          <motion.div 
            className="instructor-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="capsule-badge-outline mb-4">ABOUT TEACHMELEGAL</span>
            
            <h2 className="instructor-main-heading">
              Built On Integrity,<br />
              Driven By Justice
            </h2>
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
              Our approach is grounded in professional discretion, exam precision, and a deep commitment to achieving deep understanding—because your legal journey deserves more than notes, it deserves mastery.
            </p>

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
