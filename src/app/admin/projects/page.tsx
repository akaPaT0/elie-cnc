'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { getProjects, createProject, updateProject, deleteProject, getCategories } from '@/lib/supabase/api';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    material: '',
    dimensions: '',
    date: ''
  });

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      if (data) setProjects(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      if (data) setCategories(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const handleOpenModal = (project: any = null) => {
    if (project) {
      setSelectedProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        material: project.material || '',
        dimensions: project.dimensions || '',
        date: project.date || new Date().toISOString().split('T')[0]
      });
    } else {
      setSelectedProject(null);
      setFormData({
        title: '',
        description: '',
        category: categories.length > 0 ? categories[0].id : '',
        material: '',
        dimensions: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      images: selectedProject?.images || ['/images/placeholder.jpg'],
    };

    try {
      if (selectedProject) {
        await updateProject(selectedProject.id, payload);
      } else {
        await createProject(payload);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (e) {
      console.error(e);
    }
  };

  const confirmDelete = async () => {
    if (selectedProject) {
      try {
        await deleteProject(selectedProject.id);
        setIsDeleteModalOpen(false);
        fetchProjects();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Showcase Projects</h1>
        <button className={styles.primaryButton} onClick={() => handleOpenModal()}>+ Add Project</button>
      </div>

      <div className={styles.grid}>
        {projects.map(project => (
          <div key={project.id} className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <div className={styles.cardMeta}>
                <div>Category: {project.category}</div>
                <div>Material: {project.material}</div>
                <div>Dimensions: {project.dimensions}</div>
                <div>Date: {project.date}</div>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.actionButton} onClick={() => handleOpenModal(project)}>Edit</button>
                <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => { setSelectedProject(project); setIsDeleteModalOpen(true); }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{selectedProject ? 'Edit Project' : 'Add Project'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title</label>
                <input required className={styles.input} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <select className={styles.select} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Material</label>
                <input className={styles.input} value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} placeholder="e.g. 6061 Aluminum" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Dimensions</label>
                <input className={styles.input} value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} placeholder="e.g. 120 x 80 x 25 mm" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date</label>
                <input type="date" className={styles.input} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.primaryButton}>Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Confirm Delete</h2>
            <p>Are you sure you want to delete {selectedProject?.title}?</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button className={`${styles.primaryButton}`} style={{backgroundColor: '#F87171'}} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
