import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.css';
import { Product } from '@/data/mock';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className={styles.card}>
      <Link href={`/shop/${product.id}`} className={styles.cardLink}>
        <div className={styles.imageArea}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className={styles.placeholder}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5C5C66" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
          )}
          <div className={styles.badge}>{(product.fileType || 'STL').toUpperCase()}</div>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{product.name}</h3>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.bottom}>
            <span className={styles.price}>${Number(product.price).toFixed(2)}</span>
            <button 
              className={styles.button}
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
