'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from '@/lib/supabase/api';
import { uploadProductImage, uploadProductFile } from '@/lib/supabase/storage';

export default function ProductsManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    fileType: 'STL',
    fileSize: '',
    category: '',
    images: '',
    featured: false,
    compatibility: '',
    downloads: '0'
  });

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      if (data) setProducts(data);
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
    fetchProducts();
    fetchCategories();
  }, []);

  const handleOpenModal = (product: any = null) => {
    setFeedback(null);
    if (product) {
      setSelectedProduct(product);
      
      const compStr = Array.isArray(product.compatibility) 
        ? product.compatibility.join(', ') 
        : (product.compatibility || '');
        
      const imgStr = Array.isArray(product.images)
        ? product.images.join(', ')
        : (product.image || product.images || '');

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price !== undefined ? product.price.toString() : '0',
        fileType: product.fileType || 'STL',
        fileSize: product.fileSize || '',
        category: product.category || (categories.length > 0 ? categories[0].name : ''),
        images: imgStr,
        featured: Boolean(product.featured),
        compatibility: compStr,
        downloads: (product.downloads !== undefined ? product.downloads : 0).toString()
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        fileType: 'STL',
        fileSize: '',
        category: categories.length > 0 ? categories[0].name : '',
        images: '',
        featured: false,
        compatibility: '',
        downloads: '0'
      });
    }
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFeedback(null);
    const { url, error } = await uploadProductImage(file);
    setUploadingImage(false);

    if (error) {
      setFeedback({ type: 'error', message: `Image upload failed: ${error}` });
    } else if (url) {
      setFormData((prev) => ({ ...prev, images: url }));
      setFeedback({ type: 'success', message: 'Product image uploaded to Supabase Storage!' });
    }
  };

  const handleDigitalFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setFeedback(null);
    const { fileSize, fileType, error } = await uploadProductFile(file);
    setUploadingFile(false);

    if (error) {
      setFeedback({ type: 'error', message: `File upload failed: ${error}` });
    } else {
      setFormData((prev) => ({
        ...prev,
        fileSize: fileSize || prev.fileSize,
        fileType: fileType || prev.fileType,
      }));
      setFeedback({ type: 'success', message: `Digital file uploaded (${fileSize}, ${fileType})!` });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const compArray = typeof formData.compatibility === 'string'
      ? formData.compatibility.split(',').map((i) => i.trim()).filter(Boolean)
      : Array.isArray(formData.compatibility)
      ? formData.compatibility
      : [];

    const imgSingle = typeof formData.images === 'string'
      ? formData.images.split(',')[0]?.trim() || selectedProduct?.image || '/images/placeholder.jpg'
      : Array.isArray(formData.images)
      ? formData.images[0] || '/images/placeholder.jpg'
      : '/images/placeholder.jpg';

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      fileType: formData.fileType as 'STL' | 'GCODE' | 'STEP' | 'DXF',
      fileSize: formData.fileSize || '1.0 MB',
      category: formData.category || (categories.length > 0 ? categories[0].name : 'General'),
      image: imgSingle,
      featured: formData.featured,
      compatibility: compArray,
      downloads: parseInt(formData.downloads, 10) || 0
    };

    try {
      let result;
      if (selectedProduct) {
        result = await updateProduct(selectedProduct.id, payload);
      } else {
        result = await createProduct(payload);
      }

      if (result && !result.success) {
        setFeedback({ type: 'error', message: result.error || 'Failed to save product to Supabase.' });
      } else {
        setFeedback({ type: 'success', message: 'Product saved successfully!' });
        setTimeout(() => {
          setIsModalOpen(false);
          fetchProducts();
        }, 800);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      try {
        const result = await deleteProduct(selectedProduct.id);
        if (result && !result.success) {
          alert(`Failed to delete: ${result.error}`);
        }
        setIsDeleteModalOpen(false);
        fetchProducts();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products & Digital Files</h1>
        <div className={styles.actions}>
          <input 
            type="text" 
            placeholder="Search products..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={styles.primaryButton} onClick={() => handleOpenModal()}>+ Add Product</button>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Image</th>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>File Type</th>
            <th className={styles.th}>Price</th>
            <th className={styles.th}>Category</th>
            <th className={styles.th}>Downloads</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id} className={styles.tr}>
              <td className={styles.td}>
                {product.image ? (
                  <img src={product.image} alt={product.name} className={styles.thumbnail} />
                ) : (
                  <div className={styles.thumbnail} />
                )}
              </td>
              <td className={styles.td}>{product.name}</td>
              <td className={styles.td}><span className={styles.badge}>{product.fileType}</span></td>
              <td className={styles.td}>${product.price}</td>
              <td className={styles.td}>{product.category}</td>
              <td className={styles.td}>{product.downloads || 0}</td>
              <td className={styles.td}>
                <button className={styles.actionButton} onClick={() => handleOpenModal(product)}>Edit</button>
                <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => { setSelectedProduct(product); setIsDeleteModalOpen(true); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{selectedProduct ? 'Edit Product' : 'Add Product'}</h2>
            
            {feedback && (
              <div 
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  backgroundColor: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                  border: `1px solid ${feedback.type === 'error' ? '#EF4444' : '#22C55E'}`,
                  color: feedback.type === 'error' ? '#FCA5A5' : '#86EFAC',
                  fontSize: '0.9rem'
                }}
              >
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Product Name</label>
                <input required className={styles.input} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Price ($)</label>
                <input required type="number" step="0.01" className={styles.input} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>

              {/* Upload Image File to Supabase Storage */}
              <div className={styles.formGroup}>
                <label className={styles.label}>📷 Upload Product Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className={styles.input}
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                />
                {uploadingImage && <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>Uploading image to Supabase Storage...</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Image URL (Auto-filled on upload or manual path)</label>
                <input className={styles.input} value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="/images/placeholder.jpg" />
              </div>

              {/* Upload Digital CAD/GCODE File to Supabase Storage */}
              <div className={styles.formGroup}>
                <label className={styles.label}>📁 Upload CAD / G-Code File (.stl, .gcode, .step, .dxf)</label>
                <input 
                  type="file" 
                  accept=".stl,.gcode,.step,.stp,.dxf,.nc,.tap" 
                  className={styles.input}
                  onChange={handleDigitalFileChange}
                  disabled={uploadingFile}
                />
                {uploadingFile && <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>Uploading CAD file to Supabase Storage...</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>File Type</label>
                <select className={styles.select} value={formData.fileType} onChange={e => setFormData({...formData, fileType: e.target.value})}>
                  <option value="STL">STL</option>
                  <option value="GCODE">GCODE</option>
                  <option value="STEP">STEP</option>
                  <option value="DXF">DXF</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>File Size</label>
                <input className={styles.input} value={formData.fileSize} onChange={e => setFormData({...formData, fileSize: e.target.value})} placeholder="e.g. 1.5 MB" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <select className={styles.select} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Compatibility (comma separated)</label>
                <input className={styles.input} value={formData.compatibility} onChange={e => setFormData({...formData, compatibility: e.target.value})} placeholder="Fusion 360, SolidWorks, FreeCAD" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Download Count</label>
                <input type="number" className={styles.input} value={formData.downloads} onChange={e => setFormData({...formData, downloads: e.target.value})} placeholder="0" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                  Featured Product
                </label>
              </div>
              
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsModalOpen(false)} disabled={saving || uploadingImage || uploadingFile}>Cancel</button>
                <button type="submit" className={styles.primaryButton} disabled={saving || uploadingImage || uploadingFile}>
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Confirm Delete</h2>
            <p>Are you sure you want to delete {selectedProduct?.name}?</p>
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
