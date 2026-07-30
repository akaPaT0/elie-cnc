'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { getProducts } from '@/lib/supabase/api';
import { Product } from '@/data/mock';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      if (!id) return;
      setLoading(true);
      try {
        const allProducts = await getProducts();
        const found = allProducts.find(p => p.id === id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id);
        
        if (found) {
          setProduct(found);
          const related = allProducts
            .filter(p => p.category === found.category && p.id !== found.id)
            .slice(0, 3);
          setRelatedProducts(related);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h1>Product not found</h1>
        <Link href="/shop" className={styles.backLink}>Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb}>
        <Link href="/shop">Shop</Link>
        <span className={styles.separator}>/</span>
        <span className={styles.current}>{product.name}</span>
      </nav>

      <div className={styles.productGrid}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            {product.image && !imgError ? (
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className={styles.image}
                style={{ objectFit: 'contain', padding: '1rem' }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={styles.placeholder}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C27A3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span style={{ marginTop: '0.75rem', color: '#9A9A9A', fontSize: '0.9rem' }}>CAD File Model Preview</span>
              </div>
            )}
            <div className={styles.fileTypeBadge}>{product.fileType || 'STL'}</div>
          </div>
        </div>

        <div className={styles.detailsColumn}>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.priceRow}>
            <span className={styles.price}>${Number(product.price).toFixed(2)}</span>
            <span className={styles.fileSize}>Size: {product.fileSize || '1 MB'}</span>
          </div>
          
          <p className={styles.description}>{product.description}</p>
          
          <div className={styles.metaInfo}>
            <div className={styles.metaItem}>
              <strong>Compatibility:</strong>
              <span>
                {Array.isArray(product.compatibility) 
                  ? product.compatibility.join(', ') 
                  : (product.compatibility || 'All CNC Software')}
              </span>
            </div>
            <div className={styles.metaItem}>
              <strong>Downloads:</strong>
              <span>{product.downloads || 0}</span>
            </div>
          </div>

          <button 
            className={styles.addToCartBtn}
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>You might also like</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map(related => (
              <div key={related.id} className={styles.relatedItem}>
                <ProductCard product={related} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
