'use client';

import styles from './page.module.css';

interface Product {
  id: string;
  name: string;
  category: string;
  fileType: string;
  price: string;
}

// Mock Data
const recentProducts: Product[] = [
  { id: '1', name: 'Parametric Table Router', category: 'Furniture', fileType: 'DXF', price: '$25.00' },
  { id: '2', name: 'Minimalist Chair Set', category: 'Furniture', fileType: 'SVG', price: '$15.00' },
  { id: '3', name: 'Topographic Wall Art', category: 'Decor', fileType: 'STL', price: '$10.00' },
];

export default function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeBanner}>
        <div className={styles.welcomeText}>
          <h1>Workshop Control Center</h1>
          <p>Manage your CNC files, projects, and site content.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnPrimary}>+ Add New File</button>
          <button className={styles.btnSecondary}>+ Add Project</button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Files / Products</h3>
          <p className={styles.statValue}>142</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Active Showcase Projects</h3>
          <p className={styles.statValue}>24</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Download Count</h3>
          <p className={styles.statValue}>8,405</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Inventory Value</h3>
          <p className={styles.statValue}>$3,450</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Products</h2>
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Format</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td><span className={styles.fileBadge}>{product.fileType}</span></td>
                  <td>{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.statusBox}>
        <h3>System Status: Development Mode</h3>
        <p>Currently running with mock data. Connect Supabase to enable live data operations.</p>
      </div>
    </div>
  );
}
