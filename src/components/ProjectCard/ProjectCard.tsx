import Image from 'next/image';
import styles from './ProjectCard.module.css';
import { Project } from '@/data/mock';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageArea}>
        {project.images && project.images.length > 0 ? (
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            className={styles.image}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className={styles.placeholder}>
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5C5C66" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        )}
        <div className={styles.overlay}>
          <div className={styles.gradient}></div>
          <div className={styles.content}>
            <span className={styles.category}>{project.category}</span>
            <h3 className={styles.title}>{project.title}</h3>
            
            <div className={styles.badges}>
              {project.material && (
                <span className={styles.badge}>{project.material}</span>
              )}
              {project.dimensions && (
                <span className={styles.badge}>{project.dimensions}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
