"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
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
      <nav className="navbar">
        <div className="container nav-container">
          <Link href="/" className="logo">
            <Image
              src="/logo.png"
              alt="Teach Me Legal Logo"
              width={42}
              height={42}
              className="logo-img"
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
            <span className="logo-text">
              Teach Me <span className="highlight">Legal</span>
            </span>
          </Link>
          
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

          <div className="nav-actions">
            <ThemeToggle />

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="btn-cart"
              aria-label="View Shopping Cart"
            >
              <span className="cart-icon-symbol">🛒</span>
              <span className="cart-text">Cart</span>
              <span className="cart-count-badge">{totalCount}</span>
            </button>

            {user ? (
              <div className="user-profile-menu">
                <span className="user-name">👤 {user.name || 'Student'}</span>
                <button onClick={logoutUser} className="btn-logout" title="Log Out">Exit</button>
              </div>
            ) : (
              <div className="auth-btns desktop-only">
                <Link href="/login" className="btn btn-login">Log In</Link>
                <Link href="/signup" className="btn btn-signup">Sign Up</Link>
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
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="mobile-menu-drawer">
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
                  <Link href="/login" className="btn btn-login w-full" onClick={() => setMobileOpen(false)}>Log In</Link>
                  <Link href="/signup" className="btn btn-signup w-full" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
