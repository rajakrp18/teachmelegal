import Image from 'next/image';
import Link from 'next/link';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo-link">
              <Image src="/logo.png" alt="Teach Me Legal Logo" width={38} height={38} className="footer-logo-img" priority />
              <span className="footer-logo-text">Teach Me <span>Legal</span></span>
            </Link>
            <p className="footer-tagline">Simplifying Law</p>
            <div className="footer-contact-info">
              <p>📍 Dwarka, Delhi - 110059</p>
              <p>📞 +91 94725 68264</p>
              <p>✉️ info@teachmelegal.com</p>
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
            <h4 className="footer-heading">Download Android App</h4>
            <a href="#" className="app-download-btn">
              <span className="app-icon">🤖</span>
              <div>
                <span className="app-sub">Get it on</span>
                <span className="app-name">Google Play</span>
              </div>
            </a>
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
