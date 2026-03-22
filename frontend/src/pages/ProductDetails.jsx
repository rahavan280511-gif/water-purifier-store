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
        <div className="fade-in product-details-container">
            <button onClick={() => navigate(-1)} className="btn btn-outline back-btn">
                <ArrowLeft size={18} />
                <span>Back</span>
            </button>

            <div className="product-details-grid">
                <div className="product-image-wrapper">
                    <img src={imageUrl} alt={product.name} className="product-image" />
                </div>

                <div className="product-info-wrapper">
                    <div className="product-header">
                        <div className="product-badges">
                            <span className="badge category-badge">{product.category}</span>
                            <span className="badge brand-badge">{product.brand}</span>
                        </div>
                        <h1 className="product-name">{product.name}</h1>
                    </div>

                    <p className="product-description">
                        {product.description || "High-performance water purification system designed to provide safe, mineral-rich drinking water. Features multi-stage filtration for maximum purity."}
                    </p>

                    <div className="product-stats-grid">
                        <div className="stat-card">
                            <ShieldCheck size={24} className="stat-icon-shield" />
                            <div>
                                <p className="stat-label">Warranty</p>
                                <p className="stat-value">1 Year Standard</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <Zap size={24} className="stat-icon-zap" />
                            <div>
                                <p className="stat-label">Performance</p>
                                <p className="stat-value">High Recovery</p>
                            </div>
                        </div>
                    </div>

                    <div className="product-action-section">
                        <div className={`stock-info ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            <Info size={18} />
                            <span>{product.stock > 0 ? `${product.stock} units available` : 'Currently out of stock'}</span>
                        </div>
                        
                        <Link 
                            to={product.stock > 0 ? `/order/${product._id}` : '#'} 
                            className={`btn btn-primary order-btn ${product.stock <= 0 ? 'disabled' : ''}`}
                            style={{ pointerEvents: product.stock > 0 ? 'auto' : 'none', opacity: product.stock > 0 ? 1 : 0.6 }}
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
