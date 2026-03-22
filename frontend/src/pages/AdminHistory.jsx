import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    ShoppingBag, Wrench, Clock, User, Phone, MapPin, 
    ChevronRight, Loader2, AlertCircle, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminHistory = () => {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'service'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const endpoint = activeTab === 'orders' ? 'orders' : 'service';
            const res = await axios.get(`/api/${endpoint}`, {
                headers: { 'x-auth-token': token }
            });
            // Reverse to show newest first
            setData(res.data.reverse());
        } catch (err) {
            console.error(err);
            setError(`Failed to load ${activeTab}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container" style={{ maxWidth: '1000px', paddingBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ background: 'var(--primary-light)', p: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
                    <Clock size={32} />
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem', margin: 0 }}>Business History</h1>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Review past orders and service requests</p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <button 
                    onClick={() => setActiveTab('orders')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius)',
                        border: 'none',
                        background: activeTab === 'orders' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'orders' ? 'white' : 'var(--text-muted)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                    }}
                >
                    <ShoppingBag size={18} />
                    <span>Orders</span>
                </button>
                <button 
                    onClick={() => setActiveTab('service')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius)',
                        border: 'none',
                        background: activeTab === 'service' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'service' ? 'white' : 'var(--text-muted)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                    }}
                >
                    <Wrench size={18} />
                    <span>Service Requests</span>
                </button>
            </div>

            {error && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary)', margin: '0 auto' }} />
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Fetching your history...</p>
                </div>
            ) : data.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <Clock size={48} style={{ color: '#cbd5e1', margin: '0 auto 1rem' }} />
                    <h3>No {activeTab} yet</h3>
                    <p style={{ color: 'var(--text-muted)' }}>When customers place {activeTab}, they will appear here.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {data.map((item) => (
                        <div key={item._id} className="card fade-in" style={{ padding: '1.5rem', transition: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ flex: 1, minWidth: '250px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}>
                                        {activeTab === 'orders' ? <ShoppingBag size={18} /> : <Wrench size={18} />}
                                        <span>{activeTab === 'orders' ? item.productName : 'Service Appointment'}</span>
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', margin: '0 0 1rem' }}>{item.customerName}</h3>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <Phone size={14} />
                                            <span>{item.phone}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <Calendar size={14} />
                                            <span>{formatDate(item.createdAt)}</span>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.75rem' }}>
                                        <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <span>{item.address}</span>
                                    </div>

                                    {activeTab === 'service' && (
                                        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.95rem' }}>
                                            <strong>Issue:</strong> {item.issueDescription}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                                    <span style={{ 
                                        padding: '0.4rem 0.8rem', 
                                        borderRadius: '20px', 
                                        background: '#f1f5f9', 
                                        color: '#475569', 
                                        fontSize: '0.75rem', 
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}>
                                        ID: {item._id.slice(-6)}
                                    </span>
                                    <button 
                                        onClick={() => window.open(`https://wa.me/${item.phone}`, '_blank')}
                                        className="btn btn-outline" 
                                        style={{ color: '#10b981', borderColor: '#10b981', background: '#f0fdf4' }}
                                    >
                                        <Phone size={16} />
                                        <span>Call Customer</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminHistory;
