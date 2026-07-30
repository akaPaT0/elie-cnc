'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { projects } from '@/data/mock';
import ProjectCard from '@/components/ProjectCard/ProjectCard';

export default function GalleryPage() {
  const [filter, setFilter] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Our Work</h1>
        <p className={styles.description}>
          A showcase of our precision CNC machining capabilities. From prototyping to production, we deliver tight tolerances and exceptional surface finishes.
        </p>
      </header>

      <div className={styles.filters}>
        {categories.map(category => (
          <button
            key={category}
            className={`${styles.filterBtn} ${filter === category ? styles.active : ''}`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={`${styles.grid} ${mounted ? styles.mounted : ''}`}>
        {filteredProjects.map(project => (
          <div key={project.id} className={styles.gridItem}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
