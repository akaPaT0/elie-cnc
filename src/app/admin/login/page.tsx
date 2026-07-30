'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { createClient } from '@/lib/supabase/client';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';
  const urlError = searchParams.get('error');

  const [activeTab, setActiveTab] = useState<'email' | 'oauth'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(urlError);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (urlError) {
      setError(urlError);
    }
  }, [urlError]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    // If Supabase environment variables aren't configured yet
    if (!supabase) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      router.push(redirectTo);
      setIsLoading(false);
      return;
    }

    // Call real Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setIsLoading(false);
      setError(authError.message || 'Invalid login credentials.');
      return;
    }

    if (data.session) {
      router.push(redirectTo);
    } else {
      setIsLoading(false);
      setError('Could not establish session.');
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      setError('Please enter your email and password to register your admin account.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    if (!supabase) {
      router.push(redirectTo);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      setMessage('Account created successfully! Logging you in...');
      setTimeout(() => router.push(redirectTo), 1000);
    } else if (data.user) {
      setMessage('Registration successful! Please check your email to confirm sign-up, or log in if confirmation is disabled.');
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError(`Supabase client is not configured in .env.local yet.`);
      setIsLoading(false);
      return;
    }

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
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

        {error && <div className={styles.errorBanner}>{error}</div>}
        {message && <div className={styles.errorBanner} style={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>{message}</div>}

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
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="justmyemaile@gmail.com"
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
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

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleSignUp}
              disabled={isLoading}
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              Create Account with this Email
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
