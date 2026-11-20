"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';
import {
  IconShoppingBag,
  IconUser,
  IconChevronDown,
  IconArrowUpRight,
  IconLogout,
  IconKey,
  IconSparkles
} from './Icons';
import './Navbar.css';

const Navbar = () => {
  const { totalCount, setIsCartOpen, user, logoutUser } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    }
    if (accountDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [accountDropdownOpen]);

  // Close dropdown on navigation
  useEffect(() => {
    setAccountDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Courses', href: '/courses' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="site-header">
      <div className="nav-capsule-wrapper container">
        <nav className="navbar nav-capsule">
          {/* Logo */}
          <Link href="/" className="logo">
            <div className="logo-emblem-wrap">
              <Image
                src="/logo.png"
                alt="Teach Me Legal Logo"
                width={56}
                height={56}
                className="logo-img"
                priority
              />
            </div>
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
              <span className="cart-icon-symbol">
                <IconShoppingBag size={18} />
              </span>
              {totalCount > 0 && <span className="cart-count-badge">{totalCount}</span>}
            </button>

            {/* Light/Dark Theme Toggle Button */}
            <ThemeToggle />

            {/* Account Symbol Dropdown */}
            <div
              className="account-dropdown-wrapper"
              ref={accountDropdownRef}
            >
              <button
                type="button"
                onClick={() => setAccountDropdownOpen((prev) => !prev)}
                className={`btn-account-trigger ${accountDropdownOpen ? 'active' : ''}`}
                aria-label="Account options"
                aria-expanded={accountDropdownOpen}
                title="My Account Options"
              >
                <span className="account-icon-symbol">
                  <IconUser size={16} />
                </span>
                <span className="account-text desktop-only">Account</span>
                <span className="dropdown-caret">
                  <IconChevronDown size={12} />
                </span>
              </button>

              {accountDropdownOpen && (
                <div className="account-dropdown-menu">
                  {user ? (
                    <>
                      <div className="dropdown-user-header">
                        <span className="dropdown-user-name">{user.email?.split('@')[0] || 'Student'}</span>
                        <span className="dropdown-user-sub">Logged in</span>
                      </div>
                      <div className="dropdown-divider" />
                      <Link href="/account" className="dropdown-item" onClick={() => setAccountDropdownOpen(false)}>
                        <span className="dropdown-icon"><IconUser size={15} /></span> My Account
                      </Link>
                      <button
                        onClick={() => { logoutUser(); setAccountDropdownOpen(false); }}
                        className="dropdown-item logout-item"
                      >
                        <span className="dropdown-icon"><IconLogout size={15} /></span> Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="dropdown-item" onClick={() => setAccountDropdownOpen(false)}>
                        <span className="dropdown-icon"><IconKey size={15} /></span> Login
                      </Link>
                      <Link href="/signup" className="dropdown-item highlight-item" onClick={() => setAccountDropdownOpen(false)}>
                        <span className="dropdown-icon"><IconSparkles size={15} /></span> Sign Up
                      </Link>
                      <div className="dropdown-divider" />
                      <Link href="/account" className="dropdown-item" onClick={() => setAccountDropdownOpen(false)}>
                        <span className="dropdown-icon"><IconUser size={15} /></span> My Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link href="/courses" className="btn btn-gold btn-nav-cta desktop-only">
              <span>Start Learning</span>
              <span className="btn-arrow-icon">
                <IconArrowUpRight size={13} />
              </span>
            </Link>

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
              <div className="mobile-auth-section">
                <div className="mobile-auth-row">
                  <Link href="/login" className="mobile-auth-btn" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                  <Link href="/signup" className="mobile-auth-btn signup" onClick={() => setMobileOpen(false)}>
                    Sign Up
                  </Link>
                </div>
                <Link href="/courses" className="btn btn-gold w-full mt-2" onClick={() => setMobileOpen(false)}>
                  <span>Start Learning</span>
                  <span className="btn-arrow-icon">
                    <IconArrowUpRight size={13} />
                  </span>
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
