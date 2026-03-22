import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useWhatsAppNumber } from '../hooks/useWhatsAppNumber';

const ContactPage = () => {
    const ownerPhone = useWhatsAppNumber();
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        const msg = `Hi, I'm ${form.name} (${form.email}${form.phone ? ', ' + form.phone : ''}).\n\n${form.message}`;
        const waUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
        setTimeout(() => {
            setSending(false);
            setSent(true);
            setForm({ name: '', email: '', phone: '', message: '' });
        }, 1000);
    };

    return (
        <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Contact Us</h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>We'd love to hear from you. Reach out for any queries, service requests, or feedback.</p>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'start' }}>

                {/* Info Panel */}
                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Get in Touch</h2>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ width: 40, height: 40, background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Phone size={18} style={{ color: 'var(--primary)' }} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 700, margin: 0 }}>Phone</p>
                            <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>+91 63825 42050</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ width: 40, height: 40, background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Mail size={18} style={{ color: 'var(--primary)' }} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 700, margin: 0 }}>Email</p>
                            <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>keerthivasan3y@gmail.com</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ width: 40, height: 40, background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <MapPin size={18} style={{ color: 'var(--primary)' }} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 700, margin: 0 }}>Address</p>
                            <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>No:2/1, Chandran street, Maduvankarai, Guindy, Chennai -600032</p>
                        </div>
                    </div>

                    <div style={{ marginTop: 'auto', background: 'var(--primary-light)', borderRadius: 'var(--radius)', padding: '1rem', fontSize: '0.9rem', color: 'var(--primary)' }}>
                        <strong>Working Hours:</strong><br />
                        Mon – Sat: 9:00 AM – 6:00 PM<br />
                        Sunday: Closed
                    </div>
                </div>

                {/* Contact Form */}
                <div className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.4rem', marginTop: 0, marginBottom: '1.5rem' }}>Send a Message</h2>

                    {sent && (
                        <div className="success-msg" style={{ marginBottom: '1.5rem' }}>
                            <CheckCircle2 size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Message sent via WhatsApp! We'll get back to you soon.
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label">Your Name *</label>
                                <input type="text" className="form-input" required
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="John Doe" />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label">Email *</label>
                                <input type="email" className="form-input" required
                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="you@example.com" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone (Optional)</label>
                            <input type="tel" className="form-input"
                                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                placeholder="+91 98765 43210" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Message *</label>
                            <textarea className="form-input" rows="5" required
                                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                                placeholder="Tell us how we can help..."></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={sending}>
                            {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                            <span>{sending ? 'Sending...' : 'Send via WhatsApp'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
