import React, { useState } from 'react';
import axios from 'axios';
import { Wrench, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useWhatsAppNumber } from '../hooks/useWhatsAppNumber';

const ServicePage = () => {
    const ownerPhone = useWhatsAppNumber();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: '',
        issueDescription: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('/api/service', formData);
            setSuccess(true);

            // Send WhatsApp notification to shop owner
            const message = `*🔧 New Service Request!*%0A%0A*Customer:* ${formData.customerName}%0A*Phone:* ${formData.phone}%0A*Address:* ${formData.address}%0A%0A*Issue / Requirement:*%0A${formData.issueDescription}`;
            const waUrl = `https://wa.me/${ownerPhone}?text=${message}`;

            setTimeout(() => {
                window.open(waUrl, '_blank');
            }, 1500);

            setFormData({ customerName: '', phone: '', address: '', issueDescription: '' });
        } catch (error) {
            alert("Error submitting request. Please try again.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div className="card fade-in" style={{ padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: '#f0f9ff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Wrench size={32} style={{ color: 'var(--primary)' }} />
                    </div>
                    <h2 style={{ fontSize: '2rem' }}>Service Request</h2>
                    <p style={{ color: '#64748b' }}>Experience issues with your purifier? We're here to help.</p>
                </div>

                {success ? (
                    <div className="fade-in">
                        <div className="success-msg">
                            <CheckCircle2 size={48} style={{ marginBottom: '1rem', color: '#166534' }} />
                            <h3>Request Submitted!</h3>
                            <p>Taking you to WhatsApp to notify the shop owner directly...</p>
                        </div>
                        <button onClick={() => setSuccess(false)} className="btn btn-primary" style={{ width: '100%' }}>
                            Submit Another Request
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Customer Name</label>
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
                            <label className="form-label">Address</label>
                            <textarea
                                className="form-input"
                                required
                                rows="3"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Enter your complete address for site visit"
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Product Issue / Requirement</label>
                            <textarea
                                className="form-input"
                                required
                                rows="4"
                                value={formData.issueDescription}
                                onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                                placeholder="Describe the problem (e.g., Leaking, Slow water flow, Filter change needed)"
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={submitting}>
                            {submitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                            <span>{submitting ? 'Submitting...' : 'Send Request'}</span>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ServicePage;
