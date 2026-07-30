'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { getProducts, getProjects, getCategories } from '@/lib/supabase/api';
import { Product, Project, Category } from '@/data/mock';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [prods, projs, cats] = await Promise.all([
          getProducts(),
          getProjects(),
          getCategories(),
        ]);
        setProducts(prods || []);
        setProjects(projs || []);
        setCategories(cats || []);
      } catch (err) {
        console.error('Error loading admin stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const totalCatalogValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeText}>
          <h1>Workshop Control Center</h1>
          <p>Live metrics and management for Elie CNC digital store & showcase.</p>
        </div>
        <div className={styles.actions}>
          <Link href="/admin/products" className={styles.btnPrimary}>+ Add New File</Link>
          <Link href="/admin/projects" className={styles.btnSecondary}>+ Add Project</Link>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Digital Files</h3>
          <p className={styles.statValue}>{loading ? '...' : products.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Showcase Projects</h3>
          <p className={styles.statValue}>{loading ? '...' : projects.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Product Categories</h3>
          <p className={styles.statValue}>{loading ? '...' : categories.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Catalog Total Value</h3>
          <p className={styles.statValue}>{loading ? '...' : `$${totalCatalogValue.toFixed(2)}`}</p>
        </div>
      </div>

      <div className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className={styles.sectionTitle}>Recent Products</h2>
          <Link href="/admin/products" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', textDecoration: 'none' }}>View All Products →</Link>
        </div>
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Format</th>
                <th>Price</th>
                <th>Downloads</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td><span className={styles.fileBadge}>{product.fileType}</span></td>
                  <td>${Number(product.price).toFixed(2)}</td>
                  <td>{product.downloads || 0}</td>
                </tr>
              ))}
              {products.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No products added yet. Click "+ Add New File" above to create your first product.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.statusBox}>
        <h3>System Status: Supabase Connected</h3>
        <p>Live PostgreSQL Database synced with <strong>elie_products</strong>, <strong>elie_projects</strong>, and <strong>elie_categories</strong> tables.</p>
      </div>
    </div>
  );
}
