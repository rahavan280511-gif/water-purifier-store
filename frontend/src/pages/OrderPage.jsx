import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import { useWhatsAppNumber } from '../hooks/useWhatsAppNumber';

const OrderPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const whatsappNumber = useWhatsAppNumber();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: '',
        quantity: 1
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const orderData = {
                productId: id,
                productName: product.name,
                ...formData
            };

            await axios.post('/api/orders', orderData);
            setSuccess(true);

            // Open WhatsApp with pre-filled order message
            if (whatsappNumber) {
                const message = [
                    `🛒 *New Order*`,
                    `*Product:* ${product.name}`,
                    `*Quantity:* ${formData.quantity}`,
                    `*Name:* ${formData.customerName}`,
                    `*Phone:* ${formData.phone}`,
                    `*Address:* ${formData.address}`
                ].join('%0A');
                window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
            }

        } catch (error) {
            alert("Error placing order. Please try again.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}><Loader2 className="animate-spin" size={48} style={{ margin: '0 auto', color: 'var(--primary)' }} /></div>;

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div className="card fade-in" style={{ padding: '2rem' }}>
                <h2 className="form-title">Complete Your Order</h2>

                {success ? (
                    <div className="fade-in">
                        <div className="success-msg">
                            <CheckCircle2 size={48} style={{ marginBottom: '1rem', color: '#166534' }} />
                            <h3>Order Placed Successfully!</h3>
                            <p>Your order has been saved. A WhatsApp chat should have opened — please <strong>press Send</strong> to notify the shop owner!</p>
                        </div>
                        <button onClick={() => navigate('/')} className="btn btn-outline" style={{ width: '100%' }}>
                            Return to Shopping
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <p style={{ fontWeight: '600' }}>Item: <span style={{ color: 'var(--primary)' }}>{product.name}</span></p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                required
                                value={formData.customerName}
                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                className="form-input"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Enter your 10-digit phone number"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Delivery Address</label>
                            <textarea
                                className="form-input"
                                required
                                rows="3"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Enter your complete delivery address"
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                className="form-input"
                                min="1"
                                max={product.stock}
                                required
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                            />
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={submitting}>
                                {submitting ? <Loader2 className="animate-spin" /> : <MessageSquare size={20} />}
                                <span>{submitting ? 'Processing...' : 'Place Order & WhatsApp'}</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default OrderPage;
