import Image from 'next/image';
import Link from 'next/link';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo-box" aria-label="Teach Me Legal Home">
              <Image
                src="/logo.png"
                alt="Teach Me Legal Logo"
                width={120}
                height={120}
                className="footer-logo-img"
                priority
              />
            </Link>
            <div className="footer-brand-details">
              <Link href="/" className="footer-logo-text">
                Teach Me <span>Legal</span>
              </Link>
              <p className="footer-tagline">Simplifying Law</p>
              <div className="footer-contact-info">
                <p><span className="footer-icon">📍</span> Dwarka, Delhi - 110059</p>
                <p><span className="footer-icon">📞</span> +91 94725 68264</p>
                <p><span className="footer-icon">✉️</span> info@teachmelegal.com</p>
              </div>
            </div>
          </div>
          
          <div className="footer-links-group">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/courses">Courses</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-app-col">
            <h4 className="footer-heading">Download Our App</h4>
            <div className="app-buttons-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" className="app-download-btn">
                <span className="app-icon">
                  <svg viewBox="0 0 512 512" fill="currentColor" width="24" height="24">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                </span>
                <div>
                  <span className="app-sub">GET IT ON</span>
                  <span className="app-name">Google Play</span>
                </div>
              </a>
              <a href="#" className="app-download-btn">
                <span className="app-icon">
                  <svg viewBox="0 0 384 512" fill="currentColor" width="24" height="24">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                </span>
                <div>
                  <span className="app-sub">Download on the</span>
                  <span className="app-name">App Store</span>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>©{new Date().getFullYear()} Teach Me Legal. All Rights Reserved</p>
          <div className="footer-bottom-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/refund">Refund & Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
