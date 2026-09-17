"use client";
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard Overview', href: '/', icon: '📊' },
    { label: 'Manage Blogs', href: '/blogs', icon: '📝' },
    { label: 'Write New Blog', href: '/blogs/new', icon: '✍️' },
    { label: 'Manage Courses', href: '/courses', icon: '🎓' },
    { label: 'Manage Books & Notes', href: '/books', icon: '📖' },
    { label: 'Analytics & Traffic', href: '/analytics', icon: '📈' }
  ];

  return (
    <html lang="en">
      <body>
        <div className="admin-layout">
          {/* Sidebar Navigation */}
          <aside className="admin-sidebar">
            <Link href="/" className="admin-brand">
              <span style={{ fontSize: '1.8rem' }}>⚖️</span>
              <div>
                <div className="admin-brand-title">Teach Me <span>Legal</span></div>
              </div>
            </Link>

            <nav className="admin-nav">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="admin-sidebar-footer">
              <div className="admin-user-card">
                <div className="admin-user-avatar">PJ</div>
                <div className="admin-user-info">
                  <span className="admin-user-name">Adv. Prashant Jha</span>
                  <span className="admin-user-role">Administrator</span>
                </div>
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
