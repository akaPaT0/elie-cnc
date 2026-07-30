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
  const [customImageUrl, setCustomImageUrl] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    fileType: 'STL',
    fileSize: '',
    category: '',
    images: [] as string[],
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
    setCustomImageUrl('');

    if (product) {
      setSelectedProduct(product);
      
      const compStr = Array.isArray(product.compatibility) 
        ? product.compatibility.join(', ') 
        : (product.compatibility || '');
        
      let imgList: string[] = [];
      if (Array.isArray(product.images) && product.images.length > 0) {
        imgList = [...product.images];
      } else if (product.image) {
        imgList = [product.image];
      }

      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price !== undefined ? product.price.toString() : '0',
        fileType: product.fileType || 'STL',
        fileSize: product.fileSize || '',
        category: product.category || (categories.length > 0 ? categories[0].name : ''),
        images: imgList,
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
        images: [],
        featured: false,
        compatibility: '',
        downloads: '0'
      });
    }
    setIsModalOpen(true);
  };

  const handleImageFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImage(true);
    setFeedback(null);

    const uploadPromises = files.map((file) => uploadProductImage(file));
    const results = await Promise.all(uploadPromises);

    const successfulUrls = results.map((r) => r.url).filter(Boolean) as string[];
    const errors = results.map((r) => r.error).filter(Boolean);

    setUploadingImage(false);

    if (successfulUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...successfulUrls],
      }));
      setFeedback({ type: 'success', message: `Uploaded ${successfulUrls.length} image(s) to Supabase Storage!` });
    }

    if (errors.length > 0) {
      setFeedback({ type: 'error', message: `Upload error: ${errors.join(', ')}` });
    }
  };

  const handleAddCustomImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, customImageUrl.trim()],
    }));
    setCustomImageUrl('');
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...formData.images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const makeCoverImage = (index: number) => {
    if (index === 0) return;
    const newImages = [...formData.images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
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

    const mainImage = formData.images[0] || selectedProduct?.image || '/images/placeholder.jpg';

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      fileType: formData.fileType as 'STL' | 'GCODE' | 'STEP' | 'DXF',
      fileSize: formData.fileSize || '1.0 MB',
      category: formData.category || (categories.length > 0 ? categories[0].name : 'General'),
      image: mainImage,
      images: formData.images.length > 0 ? formData.images : [mainImage],
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
          <div className={styles.modal} style={{ maxWidth: '650px' }}>
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

              {/* Multi-Image Gallery Manager */}
              <div className={styles.formGroup} style={{ border: '1px solid #2E2E3A', padding: '1rem', borderRadius: '8px', background: '#121217' }}>
                <label className={styles.label} style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  🖼️ Product Images Gallery ({formData.images.length})
                </label>
                <p style={{ fontSize: '0.8rem', color: '#9A9A9A', marginBottom: '0.75rem' }}>
                  Upload multiple photos. The 1st photo is used as the main cover image. Use ← → to reorder or click ★ Cover to set as main thumbnail.
                </p>

                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  className={styles.input}
                  onChange={handleImageFilesChange}
                  disabled={uploadingImage}
                />
                {uploadingImage && <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', display: 'block', marginTop: '0.25rem' }}>Processing & converting images to WebP...</span>}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Or paste image URL..." 
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                  />
                  <button type="button" className={styles.primaryButton} onClick={handleAddCustomImageUrl} style={{ whiteSpace: 'nowrap' }}>+ Add URL</button>
                </div>

                {/* Thumbnails reorder list */}
                {formData.images.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
                    {formData.images.map((imgUrl, idx) => (
                      <div key={idx} style={{ position: 'relative', background: '#18181E', border: idx === 0 ? '2px solid #C27A3D' : '1px solid #2E2E3A', borderRadius: '6px', overflow: 'hidden', padding: '4px' }}>
                        <div style={{ position: 'relative', width: '100%', height: '80px' }}>
                          <img src={imgUrl} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                          {idx === 0 && (
                            <span style={{ position: 'absolute', top: 2, left: 2, background: '#C27A3D', color: '#000', fontSize: '0.65rem', fontWeight: 700, padding: '1px 4px', borderRadius: '3px' }}>
                              COVER
                            </span>
                          )}
                        </div>

                        {/* Controls */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', background: '#0E0E11', borderRadius: '4px', padding: '2px' }}>
                          <button type="button" onClick={() => moveImage(idx, 'left')} disabled={idx === 0} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: idx === 0 ? 0.3 : 1 }}>←</button>
                          {idx !== 0 && (
                            <button type="button" onClick={() => makeCoverImage(idx)} style={{ background: 'none', border: 'none', color: '#C27A3D', cursor: 'pointer', fontSize: '0.7rem' }}>★</button>
                          )}
                          <button type="button" onClick={() => moveImage(idx, 'right')} disabled={idx === formData.images.length - 1} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: idx === formData.images.length - 1 ? 0.3 : 1 }}>→</button>
                          <button type="button" onClick={() => removeImage(idx)} style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer' }}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
