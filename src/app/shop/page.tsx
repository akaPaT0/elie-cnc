'use client';

import { useState, useMemo, useEffect } from 'react';
import styles from './page.module.css';
import { getProducts, getCategories } from '@/lib/supabase/api';
import { Product, Category } from '@/data/mock';
import ProductCard from '@/components/ProductCard/ProductCard';

type SortOption = 'price-asc' | 'price-desc' | 'popular' | 'newest';
const fileTypes = ['STL', 'GCODE', 'STEP', 'DXF'];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    }
    loadData();
  }, []);

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleFileTypeToggle = (type: string) => {
    setSelectedFileTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const removeFilter = (type: 'category' | 'fileType', value: string) => {
    if (type === 'category') {
      setSelectedCategories(prev => prev.filter(c => c !== value));
    } else {
      setSelectedFileTypes(prev => prev.filter(t => t !== value));
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedFileTypes.length > 0) {
      result = result.filter(p => selectedFileTypes.includes(p.fileType));
    }

    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'newest':
        // No date field on Product, we can leave as default order or mock something
        break;
    }

    return result;
  }, [selectedCategories, selectedFileTypes, sortOption]);

  return (
    <main className={styles.shopContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Digital Files</h1>
        <p className={styles.description}>Production-ready files for your CNC machine</p>
      </header>

      <div className={styles.mainContent}>
        <button 
          className={styles.mobileFilterToggle}
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        <aside className={`${styles.sidebar} ${isMobileFiltersOpen ? styles.open : ''}`}>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Category</h3>
            <div className={styles.filterList}>
              {categories.map(cat => (
                <label key={cat.id} className={styles.filterItem}>
                  <input
                    type="checkbox"
                    className={styles.filterCheckbox}
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => handleCategoryToggle(cat.name)}
                  />
                  {cat.name} ({cat.count})
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>File Type</h3>
            <div className={styles.filterList}>
              {fileTypes.map(type => (
                <label key={type} className={styles.filterItem}>
                  <input
                    type="checkbox"
                    className={styles.filterCheckbox}
                    checked={selectedFileTypes.includes(type)}
                    onChange={() => handleFileTypeToggle(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Sort By</h3>
            <select
              className={styles.select}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        <section className={styles.resultsArea}>
          <div className={styles.resultsHeader}>
            <span className={styles.resultCount}>
              Showing {filteredAndSortedProducts.length} files
            </span>
            
            <div className={styles.activeFilters}>
              {selectedCategories.map(cat => (
                <button
                  key={cat}
                  className={styles.filterBadge}
                  onClick={() => removeFilter('category', cat)}
                >
                  {cat} <span className={styles.removeIcon}>&times;</span>
                </button>
              ))}
              {selectedFileTypes.map(type => (
                <button
                  key={type}
                  className={styles.filterBadge}
                  onClick={() => removeFilter('fileType', type)}
                >
                  {type} <span className={styles.removeIcon}>&times;</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.productGrid}>
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
            {filteredAndSortedProducts.length === 0 && (
              <p>No products found matching your filters.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
