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
  IconMoon
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
            <div className="admin-brand-wrapper">
              <Link href="/" className="admin-brand">
                {isSidebarExpanded ? (
                  <>
                    <img src="/logo.png" alt="Teach Me Legal Logo" className="admin-brand-img" />
                    <div className="admin-brand-title">Teach<span>Me</span>Legal</div>
                  </>
                ) : (
                  <img src="/logo.png" alt="Teach Me Legal" style={{ height: '32px', width: 'auto' }} />
                )}
              </Link>
              <button 
                type="button"
                className="admin-sidebar-toggle" 
                onClick={toggleSidebar} 
                title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                {isSidebarExpanded ? '◀' : '▶'}
              </button>
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
                title="Toggle Theme"
              >
                <span className="theme-icon">
                  {isDark ? <IconSun size={17} /> : <IconMoon size={17} />}
                </span>
                {isSidebarExpanded && (
                  <span className="theme-label">{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
                )}
              </button>

              <div className="admin-user-card">
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
          <div className="admin-main">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
