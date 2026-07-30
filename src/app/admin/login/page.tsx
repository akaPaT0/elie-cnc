'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [activeTab, setActiveTab] = useState<'email' | 'oauth'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setError(`OAuth with ${provider} will redirect to Supabase provider.`);
    } catch (err: any) {
      setError(err.message || `An error occurred with ${provider} sign in.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    router.push('/admin');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>ELIE CNC ADMIN ACCESS</h1>
          <p className={styles.subtitle}>Secure workshop control center</p>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            {error}
          </div>
        )}

        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'email' ? styles.active : ''}`}
            onClick={() => setActiveTab('email')}
            type="button"
          >
            Email & Password
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'oauth' ? styles.active : ''}`}
            onClick={() => setActiveTab('oauth')}
            type="button"
          >
            OAuth
          </button>
        </div>

        {activeTab === 'email' ? (
          <form className={styles.form} onSubmit={handleEmailLogin}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                id="email"
                type="email"
                required
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eliecnc.com"
                disabled={isLoading}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                required
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? <div className={styles.spinner}></div> : 'Sign In'}
            </button>
          </form>
        ) : (
          <div className={styles.form}>
            <button 
              className={`${styles.button} ${styles.oauthButton}`}
              onClick={() => handleOAuthLogin('github')}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? <div className={`${styles.spinner} ${styles.oauthSpinner}`}></div> : 'Sign in with GitHub'}
            </button>
            <button 
              className={`${styles.button} ${styles.oauthButton}`}
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? <div className={`${styles.spinner} ${styles.oauthSpinner}`}></div> : 'Sign in with Google'}
            </button>
          </div>
        )}

        <button 
          className={`${styles.button} ${styles.demoButton}`}
          onClick={handleDemoMode}
          type="button"
        >
          Demo Admin Mode (Bypass for testing)
        </button>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className={styles.container}><div className={styles.card}>Loading...</div></div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
