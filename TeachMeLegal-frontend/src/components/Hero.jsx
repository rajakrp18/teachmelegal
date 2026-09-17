"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-bg-pattern" aria-hidden="true" />
      <div className="container hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.span 
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            ⚖️ Simplifying Law for Everyone
          </motion.span>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Master the Law.<br/>
            <em>Learn from a</em><br/>
            Supreme Court Advocate.
          </motion.h1>

          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Join 30,000+ students learning Indian law through simple explanations, structured notes, and real courtroom insights by Advocate Prashant Jha.
          </motion.p>

          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link href="/courses" className="btn btn-secondary">
              📚 Explore Courses
            </Link>
            <a href="https://www.youtube.com/watch?v=hy5ji_1vu2M" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              ▶ Watch Free Lectures
            </a>
          </motion.div>

          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="hero-stat">
              <span className="hero-stat-number">100K+</span>
              <span className="hero-stat-label">YouTube Subscribers</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-number">30K+</span>
              <span className="hero-stat-label">Enrolled Students</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-number">50+</span>
              <span className="hero-stat-label">Courses & Books</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="hero-photo-frame">
            <Image
              src="/prashant-jha.jpg"
              alt="Advocate Prashant Jha — Teach Me Legal"
              width={420}
              height={520}
              className="hero-photo"
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
            <motion.div 
              className="hero-float-badge top-badge"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <span>⚖️</span>
              <div>
                <strong>Supreme Court</strong>
                <span>Practicing Advocate</span>
              </div>
            </motion.div>

            <motion.div 
              className="hero-float-badge bottom-badge"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
            >
              <span>🎓</span>
              <div>
                <strong>30,000+</strong>
                <span>Happy Students</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

