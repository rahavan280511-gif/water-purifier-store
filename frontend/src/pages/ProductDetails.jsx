import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, ShieldCheck, Zap, Info, Loader2 } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`/api/products/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}><Loader2 className="animate-spin" size={48} style={{ margin: '0 auto', color: 'var(--primary)' }} /></div>;
    if (!product) return <div style={{ textAlign: 'center', padding: '5rem' }}><h2>Product not found</h2><Link to="/" className="btn btn-primary">Back to Home</Link></div>;

    const imageUrl = product.image ? (product.image.startsWith('http') ? product.image : `/${product.image}`) : 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600&auto=format&fit=crop';

    return (
        <div className="fade-in">
            <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '2rem' }}>
                <ArrowLeft size={18} />
                <span>Back</span>
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={imageUrl} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', marginRight: '0.5rem' }}>{product.category}</span>
                        <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>{product.brand}</span>
                        <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{product.name}</h1>
                    </div>

                    <p style={{ color: '#475569', fontSize: '1.125rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                        {product.description || "High-performance water purification system designed to provide safe, mineral-rich drinking water. Features multi-stage filtration for maximum purity."}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius)' }}>
                            <ShieldCheck size={24} style={{ color: '#10b981' }} />
                            <div>
                                <p style={{ fontWeight: '700', fontSize: '0.875rem' }}>Warranty</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>1 Year Standard</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius)' }}>
                            <Zap size={24} style={{ color: '#f59e0b' }} />
                            <div>
                                <p style={{ fontWeight: '700', fontSize: '0.875rem' }}>Performance</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>High Recovery</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: product.stock > 0 ? '#10b981' : '#ef4444' }}>
                            <Info size={18} />
                            <span style={{ fontWeight: '600' }}>{product.stock > 0 ? `${product.stock} units available` : 'Currently out of stock'}</span>
                        </div>
                        
                        <Link 
                            to={product.stock > 0 ? `/order/${product._id}` : '#'} 
                            className={`btn btn-primary ${product.stock <= 0 ? 'disabled' : ''}`}
                            style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem', pointerEvents: product.stock > 0 ? 'auto' : 'none', opacity: product.stock > 0 ? 1 : 0.6 }}
                        >
                            <ShoppingCart size={22} />
                            <span>Order Now</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
