'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './layout.module.css';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('justmyemaile@gmail.com');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  
  useEffect(() => {
    async function checkUserSession() {
      const supabase = createClient();
      if (supabase) {
        setIsConnected(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
        }
      } else {
        setIsConnected(false);
      }
    }
    checkUserSession();
  }, []);

  // If we are on the login page, don't show the admin shell wrapper.
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Determine current section title based on pathname
  const getSectionTitle = () => {
    if (pathname === '/admin') return 'Overview';
    if (pathname.includes('/admin/products')) return 'Products';
    if (pathname.includes('/admin/projects')) return 'Projects';
    if (pathname.includes('/admin/categories')) return 'Categories';
    return 'Admin';
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/admin/login');
  };

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>ELIE CNC</h2>
          <span className={styles.badge}>ADMIN</span>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin" className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}>
            Overview
          </Link>
          <Link href="/admin/products" className={`${styles.navLink} ${pathname.includes('/admin/products') ? styles.active : ''}`}>
            Products
          </Link>
          <Link href="/admin/projects" className={`${styles.navLink} ${pathname.includes('/admin/projects') ? styles.active : ''}`}>
            Projects
          </Link>
          <Link href="/admin/categories" className={`${styles.navLink} ${pathname.includes('/admin/categories') ? styles.active : ''}`}>
            Categories
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>{userEmail}</span>
            <div className={styles.statusIndicator}>
              <span className={`${styles.statusDot} ${isConnected ? styles.connected : styles.mock}`}></span>
              {isConnected ? 'Supabase Connected' : 'Mock Mode'}
            </div>
          </div>
          <button onClick={handleSignOut} className={styles.signOutButton}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.breadcrumbs}>
            Admin / <span className={styles.breadcrumbActive}>{getSectionTitle()}</span>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
            View Live Site ↗
          </a>
        </header>

        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
}
