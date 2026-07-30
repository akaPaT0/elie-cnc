'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { getCategories, createCategory, deleteCategory } from '@/lib/supabase/api';

export default function CategoriesManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      if (data) setCategories(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ name, slug });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory(formData.name, formData.slug);
      setIsModalOpen(false);
      setFormData({ name: '', slug: '' });
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Categories</h1>
        <button className={styles.primaryButton} onClick={() => setIsModalOpen(true)}>+ Add Category</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Slug</th>
            <th className={styles.th}>Item Count</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id} className={styles.tr}>
              <td className={styles.td}>{category.name}</td>
              <td className={styles.td}><span className={styles.slug}>{category.slug}</span></td>
              <td className={styles.td}>{category.itemCount || 0}</td>
              <td className={styles.td}>
                <button className={styles.actionButton} onClick={() => handleDelete(category.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan={4} className={styles.td} style={{textAlign: 'center', color: '#9A9A9A'}}>No categories found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Add Category</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Name</label>
                <input required className={styles.input} value={formData.name} onChange={handleNameChange} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Slug</label>
                <input required className={styles.input} value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
              </div>
              
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryButton}>Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
