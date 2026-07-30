'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function AboutPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll(`.${styles.animate}`);
    elements.forEach(el => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className={styles.container}>
      <section className={`${styles.hero} ${styles.animate}`}>
        <h1 className={styles.title}>About Elie CNC</h1>
        <p className={styles.subtitle}>Precision machining meets artisan craftsmanship.</p>
      </section>

      <section className={`${styles.story} ${styles.animate}`}>
        <div className={styles.textContent}>
          <h2>Our Story</h2>
          <p>
            What started as a modest garage setup driven by a passion for creating perfectly toleranced parts has grown into a full-scale CNC workshop. At Elie CNC, we believe that the gap between digital design and physical reality should be seamless.
          </p>
          <p>
            Whether it&apos;s a one-off custom enclosure for a specialized electronics project, or a short production run of mechanical brackets, we approach every job with the same obsessive attention to detail. We aren&apos;t just machine operators; we are makers, designers, and problem solvers who take pride in turning raw aluminum, brass, and hardwoods into functional art.
          </p>
        </div>
      </section>

      <section className={`${styles.capabilities} ${styles.animate}`}>
        <h2>Core Capabilities</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.icon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h3>3D Carving</h3>
            <p>Intricate topographical maps, flowing organic shapes, and deep relief carving using advanced CAM strategies and tapered tools.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/></svg>
            </div>
            <h3>Precision Milling</h3>
            <p>Holding tight tolerances on aluminum, brass, and engineering plastics for functional mechanical components and assemblies.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
            </div>
            <h3>Sign Making</h3>
            <p>From V-carved hardwood signs with epoxy inlays to backlit acrylic and brass corporate signage.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.icon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <h3>Prototyping</h3>
            <p>Rapid turnaround on functional prototypes to help you validate your designs before committing to mass production.</p>
          </div>
        </div>
      </section>

      <section className={`${styles.machines} ${styles.animate}`}>
        <h2>Our Equipment</h2>
        <div className={styles.machineGrid}>
          <div className={styles.machineCard}>
            <h3>Main Mill: Tormach PCNC 440</h3>
            <ul className={styles.specs}>
              <li><strong>Spindle:</strong> 10,000 RPM</li>
              <li><strong>Work Envelope:</strong> 10" x 6.25" x 10"</li>
              <li><strong>Materials:</strong> Aluminum, Brass, Steel, Titanium</li>
              <li><strong>Tolerance:</strong> ±0.001"</li>
            </ul>
          </div>
          <div className={styles.machineCard}>
            <h3>Router: Shapeoko Pro XXL</h3>
            <ul className={styles.specs}>
              <li><strong>Spindle:</strong> 1.2kW 24,000 RPM</li>
              <li><strong>Work Envelope:</strong> 33" x 33" x 4"</li>
              <li><strong>Materials:</strong> Hardwoods, Plywood, Plastics, Foam</li>
              <li><strong>Specialty:</strong> Large format panel work, signage</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={`${styles.cta} ${styles.animate}`}>
        <h2>Ready to build something?</h2>
        <p>Whether you need a single prototype or a batch of parts, we are here to help bring your project to life.</p>
        <Link href="/contact" className={styles.ctaButton}>Want to work together?</Link>
      </section>
    </div>
  );
}
