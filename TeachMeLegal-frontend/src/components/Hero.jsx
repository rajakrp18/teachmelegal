"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  IconScales, 
  IconStar, 
  IconPlay, 
  IconArrowUpRight, 
  IconMedal, 
  IconTrendUp, 
  IconGraduationCap, 
  IconShieldCheck 
} from './Icons';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      {/* Background Radial Glow & Mesh Gradients */}
      <div className="hero-glow-backdrop" aria-hidden="true" />
      <div className="hero-scales-watermark" aria-hidden="true">
        <IconScales size={360} />
      </div>
      
      <div className="container hero-container">
        {/* Left Column: Headline & Primary CTAs */}
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Top Capsule Credential Badge */}
          <motion.div 
            className="capsule-badge hero-credential-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <span className="badge-icon">
              <IconScales size={15} />
            </span>
            <span>SUPREME COURT ADVOCATE & LEGAL EDUCATOR</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Your Ultimate<br/>
            Legal Learning<br/>
            <span className="gold-highlight">Partner</span>
          </motion.h1>

          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Simplifying complex Indian laws through structured video lectures, battle-tested exam charts, and real courtroom insights by Advocate Prashant Jha.
          </motion.p>

          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link href="/courses" className="btn btn-gold hero-cta-btn">
              <span>Explore Courses</span>
              <span className="btn-arrow-icon">
                <IconArrowUpRight size={13} />
              </span>
            </Link>

            <a 
              href="https://www.youtube.com/watch?v=hy5ji_1vu2M" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline-dark hero-secondary-btn"
            >
              <span className="btn-play-icon">
                <IconPlay size={13} />
              </span>
              <span>Watch Free Lectures</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Right Column: Visual Portrait & Floating Rating Card */}
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="hero-portrait-frame">
            <div className="portrait-glow-halo" />
            <Image
              src="/prashant-jha.jpg"
              alt="Advocate Prashant Jha — Teach Me Legal"
              width={420}
              height={520}
              className="hero-photo"
              priority
            />

            {/* Compact Floating Rating Badge */}
            <motion.div 
              className="floating-rating-badge dark-glass"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="badge-icon-star">
                <IconStar size={24} />
              </div>
              <div className="badge-text-group">
                <strong>4.9 Rating</strong>
                <span>100k+ Students</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Horizontal Full-Width Metric Strip (Section Footer in Hero) */}
      <div className="hero-metrics-strip">
        <div className="container metrics-grid">
          <div className="metric-item">
            <div className="metric-icon">
              <IconMedal size={24} />
            </div>
            <div className="metric-text">
              <strong>10+ Years</strong>
              <span>Legal Experience</span>
            </div>
          </div>

          <div className="metric-divider" />

          <div className="metric-item">
            <div className="metric-icon">
              <IconTrendUp size={24} />
            </div>
            <div className="metric-text">
              <strong>95% Pass Rate</strong>
              <span>Exam Success</span>
            </div>
          </div>

          <div className="metric-divider" />

          <div className="metric-item">
            <div className="metric-icon">
              <IconGraduationCap size={24} />
            </div>
            <div className="metric-text">
              <strong>100,000+</strong>
              <span>Enrolled Students</span>
            </div>
          </div>

          <div className="metric-divider" />

          <div className="metric-item">
            <div className="metric-icon">
              <IconShieldCheck size={24} />
            </div>
            <div className="metric-text">
              <strong>100% Verified</strong>
              <span>Courtroom Curriculum</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
