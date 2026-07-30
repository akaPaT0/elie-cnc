'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { products, Product } from '@/data/mock';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        const related = products
          .filter(p => p.category === foundProduct.category && p.id !== id)
          .slice(0, 3);
        setRelatedProducts(related);
      } else {
        setProduct(null);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
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
            {product.image ? (
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className={styles.image}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className={styles.placeholder}>No image available</div>
            )}
            <div className={styles.fileTypeBadge}>{product.fileType}</div>
          </div>
        </div>

        <div className={styles.detailsColumn}>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.priceRow}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            <span className={styles.fileSize}>Size: {product.fileSize}</span>
          </div>
          
          <p className={styles.description}>{product.description}</p>
          
          <div className={styles.metaInfo}>
            <div className={styles.metaItem}>
              <strong>Compatibility:</strong>
              <span>{product.compatibility.join(', ')}</span>
            </div>
            <div className={styles.metaItem}>
              <strong>Downloads:</strong>
              <span>{product.downloads}</span>
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
