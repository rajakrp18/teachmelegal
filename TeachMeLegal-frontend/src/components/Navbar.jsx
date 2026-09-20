"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { totalCount, setIsCartOpen, user, logoutUser } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Courses', href: '/courses' },
    { name: 'Books', href: '/books' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="site-header">
      <div className="nav-capsule-wrapper container">
        <nav className="navbar nav-capsule">
          {/* Logo */}
          <Link href="/" className="logo">
            <Image
              src="/logo.png"
              alt="Teach Me Legal Logo"
              width={38}
              height={38}
              className="logo-img"
              priority
            />
            <span className="logo-text">
              Teach<span className="highlight">Me</span>Legal
            </span>
          </Link>
          
          {/* Desktop Nav Links Pill Bar */}
          <div className="nav-links desktop-only">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Actions & Gold Arrow Button */}
          <div className="nav-actions">
            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn-cart"
              aria-label="View Shopping Cart"
              title="Shopping Cart"
            >
              <span className="cart-icon-symbol">🛍️</span>
              {totalCount > 0 && <span className="cart-count-badge">{totalCount}</span>}
            </button>

            {user ? (
              <div className="user-profile-menu">
                <Link href="/account" className="nav-account-link">My Account</Link>
                <button onClick={logoutUser} className="btn-logout" title="Log Out">Exit</button>
              </div>
            ) : (
              <div className="auth-btns desktop-only">
                <Link href="/courses" className="btn btn-gold btn-nav-cta">
                  <span>Start Learning</span>
                  <span className="btn-arrow-icon">↗</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className={`hamburger-btn ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="mobile-menu-drawer container">
          <div className="mobile-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-nav-link ${pathname === link.href ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <div className="mobile-auth-btns">
                <Link href="/courses" className="btn btn-gold w-full" onClick={() => setMobileOpen(false)}>
                  <span>Start Learning</span>
                  <span className="btn-arrow-icon">↗</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

