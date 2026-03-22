import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    PlusCircle, CheckCircle2, Loader2, Package, Trash2,
    AlertTriangle, RefreshCw, Pencil, X, UploadCloud, ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = { name: '', brand: '', category: 'RO Purifier', stock: 0, description: '', image: '' };

const AdminPage = () => {
    const { token } = useAuth();
    const fileInputRef = useRef();

    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Edit modal state
    const [editProduct, setEditProduct] = useState(null);
    const [editForm, setEditForm] = useState(EMPTY_FORM);
    const [editSaving, setEditSaving] = useState(false);
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState('');
    const editFileInputRef = useRef();

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data);
        } catch (err) { console.error(err); }
        finally { setLoadingProducts(false); }
    };

    // Handle image file selection
    const handleImageFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setFormData(f => ({ ...f, image: '' })); // clear URL if file chosen
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let imageUrl = formData.image;

            // If file selected, upload it first
            if (imageFile) {
                const fd = new FormData();
                fd.append('image', imageFile);
                const uploadRes = await axios.post('/api/upload', fd, {
                    headers: { 'x-auth-token': token }
                });
                imageUrl = uploadRes.data.imageUrl;
            }

            await axios.post('/api/products', { ...formData, image: imageUrl }, {
                headers: { 'x-auth-token': token }
            });

            setSuccess('Product added successfully!');
            setFormData(EMPTY_FORM);
            setImageFile(null);
            setImagePreview('');
            fetchProducts();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error("Add Product Error:", err.response?.data || err.message);
            const status = err.response?.status;
            if (status === 401) {
                alert('Your session has expired. Please log out and log in again.');
            } else {
                alert(`Error adding product: ${err.response?.data?.error || err.response?.data?.message || err.message}`);
            }
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`/api/products/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            alert("Error deleting product.");
        }
    };

    const openEdit = (product) => {
        setEditProduct(product);
        setEditForm({
            name: product.name,
            brand: product.brand,
            category: product.category,
            stock: product.stock,
            description: product.description || '',
            image: product.image || ''
        });
        setEditImageFile(null);
        setEditImagePreview(product.image ? (product.image.startsWith('http') ? product.image : `/${product.image}`) : '');
    };

    const handleEditSave = async () => {
        setEditSaving(true);
        try {
            let imageUrl = editForm.image;

            if (editImageFile) {
                const fd = new FormData();
                fd.append('image', editImageFile);
                const uploadRes = await axios.post('/api/upload', fd, {
                    headers: { 'x-auth-token': token }
                });
                imageUrl = uploadRes.data.imageUrl;
            }

            const res = await axios.put(`/api/products/${editProduct._id}`, { ...editForm, image: imageUrl }, {
                headers: { 'x-auth-token': token }
            });
            setProducts(products.map(p => p._id === editProduct._id ? res.data : p));
            setEditProduct(null);
            setSuccess('Product updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error("Update Error:", err.response?.data || err.message);
            const status = err.response?.status;
            if (status === 401) {
                alert('Your session has expired. Please log out and log in again.');
            } else {
                alert(`Error updating product: ${err.response?.data?.error || err.response?.data?.message || err.message}`);
            }
        } finally { setEditSaving(false); }
    };

    const handleEditImageFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setEditImageFile(file);
        setEditImagePreview(URL.createObjectURL(file));
        setEditForm(f => ({ ...f, image: '' }));
    };

    return (
        <div className="container" style={{ maxWidth: '1050px' }}>

            {/* Edit Modal */}
            {editProduct && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '1rem'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '560px', padding: '2rem', position: 'relative' }}>
                        <button onClick={() => setEditProduct(null)} style={{
                            position: 'absolute', top: '1rem', right: '1rem',
                            background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'
                        }}><X size={20} /></button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <Pencil size={20} style={{ color: 'var(--primary)' }} />
                            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Edit Product</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {[['name', 'Name', 'text'], ['brand', 'Brand', 'text'], ['stock', 'Stock', 'number']].map(([key, label, type]) => (
                                <div className="form-group" key={key} style={{ margin: 0 }}>
                                    <label className="form-label">{label}</label>
                                    <input type={type} className="form-input"
                                        value={editForm[key]}
                                        onChange={e => setEditForm({ ...editForm, [key]: e.target.value })} />
                                </div>
                            ))}
                        </div>

                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label className="form-label">Category</label>
                            <select className="form-input" value={editForm.category}
                                onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                                <option>RO Purifier</option>
                                <option>UV Purifier</option>
                                <option>Spare Part</option>
                                <option>Filter Cartridge</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Product Image</label>
                            <div
                                onClick={() => editFileInputRef.current.click()}
                                style={{
                                    border: `2px dashed ${editImagePreview ? 'var(--primary)' : 'var(--border)'}`,
                                    borderRadius: 'var(--radius)',
                                    padding: '1.25rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    marginBottom: '0.75rem',
                                    background: editImagePreview ? '#f0fdf4' : '#f8fafc',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {editImagePreview ? (
                                    <img src={editImagePreview} alt="preview" style={{ height: '80px', objectFit: 'contain', borderRadius: 4 }} />
                                ) : (
                                    <>
                                        <UploadCloud size={28} style={{ color: '#94a3b8', margin: '0 auto 0.5rem' }} />
                                        <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>Click to upload a new image</p>
                                    </>
                                )}
                            </div>
                            <input type="file" accept="image/*" ref={editFileInputRef} style={{ display: 'none' }} onChange={handleEditImageFile} />
                            
                            {!editImageFile && (
                                <input type="text" className="form-input"
                                    placeholder="...or update image URL"
                                    value={editForm.image}
                                    onChange={e => setEditForm({ ...editForm, image: e.target.value })} />
                            )}
                            {editImageFile && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#10b981' }}>
                                    <ImageIcon size={14} />
                                    <span>{editImageFile.name} (Ready to upload)</span>
                                    <button type="button" onClick={() => { setEditImageFile(null); setEditImagePreview(editProduct.image ? (editProduct.image.startsWith('http') ? editProduct.image : `/${editProduct.image}`) : ''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0, lineHeight: 1 }}><X size={14} /></button>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-input" rows="3"
                                value={editForm.description}
                                onChange={e => setEditForm({ ...editForm, description: e.target.value })}></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button onClick={() => setEditProduct(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                            <button onClick={handleEditSave} className="btn btn-primary" style={{ flex: 1 }} disabled={editSaving}>
                                {editSaving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                                <span>{editSaving ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="admin-dashboard-grid">

                {/* Add Product Form */}
                <div className="card fade-in" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <PlusCircle size={24} style={{ color: 'var(--primary)' }} />
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Add New Product</h2>
                    </div>

                    {success && (
                        <div className="success-msg" style={{ marginBottom: '1.5rem', padding: '0.75rem' }}>
                            <CheckCircle2 size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Brand</label>
                                <input type="text" className="form-input" required value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Stock</label>
                                <input type="number" className="form-input" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                <option>RO Purifier</option>
                                <option>UV Purifier</option>
                                <option>Spare Part</option>
                                <option>Filter Cartridge</option>
                            </select>
                        </div>

                        {/* Image upload or URL */}
                        <div className="form-group">
                            <label className="form-label">Product Image</label>

                            {/* Drop zone */}
                            <div
                                onClick={() => fileInputRef.current.click()}
                                style={{
                                    border: `2px dashed ${imagePreview ? 'var(--primary)' : 'var(--border)'}`,
                                    borderRadius: 'var(--radius)',
                                    padding: '1.25rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    marginBottom: '0.75rem',
                                    background: imagePreview ? '#f0fdf4' : '#f8fafc',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="preview" style={{ height: '80px', objectFit: 'contain', borderRadius: 4 }} />
                                ) : (
                                    <>
                                        <UploadCloud size={28} style={{ color: '#94a3b8', margin: '0 auto 0.5rem' }} />
                                        <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>Click to upload an image</p>
                                    </>
                                )}
                            </div>
                            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageFile} />

                            {imageFile ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#10b981' }}>
                                    <ImageIcon size={14} />
                                    <span>{imageFile.name}</span>
                                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0, lineHeight: 1 }}><X size={14} /></button>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="...or paste an image URL"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-input" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={submitting}>
                            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Package size={18} />}
                            <span>{submitting ? 'Publishing...' : 'Publish Product'}</span>
                        </button>
                    </form>
                </div>

                {/* Manage Catalog List */}
                <div className="card fade-in" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <RefreshCw size={22} style={{ color: 'var(--primary)' }} />
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Manage Catalog</h2>
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{products.length} Items</span>
                    </div>

                    {loadingProducts ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <Loader2 className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto' }} />
                            <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>Loading catalog...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius)' }}>
                            <AlertTriangle size={32} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
                            <p style={{ color: 'var(--text-light)' }}>No products found.</p>
                        </div>
                    ) : (
                        <div style={{ maxHeight: '620px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                            {products.slice().reverse().map(product => (
                                <div key={product._id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.85rem 0.5rem',
                                    borderBottom: '1px solid var(--border)',
                                    gap: '0.75rem'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        background: '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {product.image ? (
                                            <img 
                                                src={product.image.startsWith('http') ? product.image : `/${product.image}`} 
                                                alt="" 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/40?text=?';
                                                }}
                                            />
                                        ) : (
                                            <ImageIcon size={18} style={{ color: '#94a3b8' }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h4 style={{ margin: 0, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
                                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-light)' }}>
                                            {product.brand} • Stock: {product.stock}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                                        <button onClick={() => openEdit(product)} title="Edit"
                                            style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}
                                            onMouseOver={e => e.currentTarget.style.background = '#eff6ff'}
                                            onMouseOut={e => e.currentTarget.style.background = 'none'}>
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(product._id)} title="Delete"
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem', borderRadius: '50%', display: 'flex' }}
                                            onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
                                            onMouseOut={e => e.currentTarget.style.background = 'none'}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminPage;
