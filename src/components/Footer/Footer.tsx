import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.column}>
            <h3 className={styles.heading}>Elie CNC</h3>
            <p className={styles.about}>
              Premium CNC showcase and file marketplace. High-quality designs for your next fabrication project.
            </p>
          </div>
          <div className={styles.column}>
            <h3 className={styles.heading}>Quick Links</h3>
            <ul className={styles.list}>
              <li><Link href="/" className={styles.link}>Home</Link></li>
              <li><Link href="/gallery" className={styles.link}>Gallery</Link></li>
              <li><Link href="/shop" className={styles.link}>Shop</Link></li>
              <li><Link href="/about" className={styles.link}>About</Link></li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3 className={styles.heading}>Contact</h3>
            <ul className={styles.list}>
              <li><a href="mailto:hello@eliecnc.com" className={styles.link}>hello@eliecnc.com</a></li>
              <li><Link href="/contact" className={styles.link}>Contact Form</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>© {new Date().getFullYear()} Elie CNC. All rights reserved.</p>
          <div className={styles.social}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
