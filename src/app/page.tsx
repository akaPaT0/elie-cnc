'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { products, projects } from '@/data/mock';
import ProductCard from '@/components/ProductCard/ProductCard';
import ProjectCard from '@/components/ProjectCard/ProjectCard';

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll(`.${styles.section}`);
    sections.forEach((section) => observerRef.current?.observe(section));

    return () => observerRef.current?.disconnect();
  }, []);

  const featuredProjects = projects.slice(0, 4);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <h1 className={styles.headline}>
            Precision Machined.
            <span className={styles.headlineHighlight}>Digitally Delivered.</span>
          </h1>
          <p className={styles.subtext}>
            CNC work showcase and production-ready digital files for makers and manufacturers.
          </p>
          <div className={styles.actions}>
            <Link href="/shop" className={styles.primaryButton}>
              Browse Files
            </Link>
            <Link href="/gallery" className={styles.secondaryButton}>
              View Gallery
            </Link>
          </div>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>500+</span>
              <span className={styles.statLabel}>Files Sold</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>50+</span>
              <span className={styles.statLabel}>Projects</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>4.9★</span>
              <span className={styles.statLabel}>Rating</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Projects</h2>
          <Link href="/gallery" className={styles.viewAllLink}>
            View All Work &rarr;
          </Link>
        </div>
        <div className={styles.grid}>
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Popular Files</h2>
          <Link href="/shop" className={styles.viewAllLink}>
            Browse All Files &rarr;
          </Link>
        </div>
        <div className={styles.grid}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.ctaBanner}>
          <h2 className={styles.ctaTitle}>Need Custom CNC Work?</h2>
          <p className={styles.ctaDesc}>
            From one-off prototypes to small batch production runs. We work with aluminum, brass, plastics, and hardwoods.
          </p>
          <Link href="/contact" className={styles.primaryButton}>
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
