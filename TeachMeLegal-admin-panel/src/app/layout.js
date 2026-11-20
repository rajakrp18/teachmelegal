"use client";
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  IconDashboard,
  IconUsers,
  IconBlog,
  IconEdit,
  IconGraduationCap,
  IconBookOpen,
  IconAnalytics,
  IconSun,
  IconMoon,
  IconChevronRight,
  IconChevronLeft
} from '../components/Icons';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme === 'dark') setIsDark(true);

    const savedSidebar = localStorage.getItem('adminSidebar');
    if (savedSidebar === 'collapsed') setIsSidebarExpanded(false);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('adminTheme', newTheme ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    const newState = !isSidebarExpanded;
    setIsSidebarExpanded(newState);
    localStorage.setItem('adminSidebar', newState ? 'expanded' : 'collapsed');
  };

  const handleMainCanvasClick = () => {
    if (isSidebarExpanded) {
      setIsSidebarExpanded(false);
      localStorage.setItem('adminSidebar', 'collapsed');
    }
  };

  const navItems = [
    { label: 'Dashboard Overview', href: '/', icon: <IconDashboard size={19} /> },
    { label: 'Users & Scholars', href: '/users', icon: <IconUsers size={19} /> },
    { label: 'Manage Blogs', href: '/blogs', icon: <IconBlog size={19} /> },
    { label: 'Write New Blog', href: '/blogs/new', icon: <IconEdit size={19} /> },
    { label: 'Manage Courses', href: '/courses', icon: <IconGraduationCap size={19} /> },
    { label: 'Manage Books & Notes', href: '/books', icon: <IconBookOpen size={19} /> },
    { label: 'Analytics & Traffic', href: '/analytics', icon: <IconAnalytics size={19} /> }
  ];

  return (
    <html lang="en">
      <body>
        <div className={`admin-layout ${isSidebarExpanded ? '' : 'sidebar-collapsed'}`}>
          {/* Sidebar Navigation */}
          <aside className="admin-sidebar">
            <div 
              className="admin-brand-wrapper"
              onClick={() => {
                if (!isSidebarExpanded) toggleSidebar();
              }}
              title={!isSidebarExpanded ? "Click to expand sidebar" : ""}
              style={{ cursor: !isSidebarExpanded ? "pointer" : "default" }}
            >
              <Link 
                href="/" 
                className="admin-brand"
                onClick={(e) => {
                  if (!isSidebarExpanded) {
                    e.preventDefault();
                    toggleSidebar();
                  }
                }}
              >
                {isSidebarExpanded ? (
                  <>
                    <img src="/logo.png" alt="Teach Me Legal Logo" className="admin-brand-img" />
                    <div className="admin-brand-title">Teach<span>Me</span>Legal</div>
                  </>
                ) : (
                  <img src="/logo.png" alt="Teach Me Legal" className="admin-brand-img-collapsed" />
                )}
              </Link>

              {/* Sidebar toggle buttons */}
              {isSidebarExpanded ? (
                <button 
                  type="button"
                  className="admin-sidebar-toggle" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSidebar();
                  }} 
                  title="Collapse Sidebar"
                  aria-label="Collapse Sidebar"
                >
                  <IconChevronLeft size={16} />
                </button>
              ) : (
                <button 
                  type="button"
                  className="admin-sidebar-expand-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSidebar();
                  }} 
                  title="Expand Sidebar"
                  aria-label="Expand Sidebar"
                >
                  <IconChevronRight size={16} />
                </button>
              )}
            </div>

            <nav className="admin-nav">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                    title={!isSidebarExpanded ? item.label : ''}
                  >
                    <span className="admin-nav-icon">{item.icon}</span>
                    {isSidebarExpanded && <span className="admin-nav-label">{item.label}</span>}
                  </Link>
                );
              })}
            </nav>

            <div className="admin-sidebar-footer">
              <button 
                type="button" 
                className="admin-theme-toggle" 
                onClick={toggleTheme} 
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <span className="theme-icon">
                  {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
                </span>
                {isSidebarExpanded && (
                  <span className="theme-label">{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
                )}
              </button>

              <div className="admin-user-card" title="Adv. Prashant Jha (Administrator)">
                <div className="admin-user-avatar">PJ</div>
                {isSidebarExpanded && (
                  <div className="admin-user-info">
                    <span className="admin-user-name">Adv. Prashant Jha</span>
                    <span className="admin-user-role">Administrator</span>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="admin-main" onClick={handleMainCanvasClick}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
