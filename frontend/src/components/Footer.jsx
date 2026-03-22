import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight, Droplets, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ background: '#0f172a', color: 'white', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                    
                    {/* Brand Section */}
                    <div>
                        <Link to="/" className="logo" style={{ color: 'white', marginBottom: '1.5rem', display: 'flex' }}>
                            <Droplets size={24} style={{ color: 'var(--primary)' }} />
                            <span>RIDER TECH -ASTRA</span>
                        </Link>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                            Providing clean, pure, and safe drinking water solutions for homes and offices since 2010. Your health is our priority.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="#" style={{ color: '#94a3b8' }}><Facebook size={20} /></a>
                            <a href="#" style={{ color: '#94a3b8' }}><Instagram size={20} /></a>
                            <a href="#" style={{ color: '#94a3b8' }}><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Quick Links</h3>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><Link to="/" style={{ color: '#94a3b8' }}>Home</Link></li>
                            <li><Link to="/about" style={{ color: '#94a3b8' }}>About Us</Link></li>
                            <li><Link to="/service" style={{ color: '#94a3b8' }}>Service Request</Link></li>
                            <li><Link to="/contact" style={{ color: '#94a3b8' }}>Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Reach Us</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No:2/1, Chandran street, Maduvankarai, Guindy, Chennai -600032</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <Phone size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>+91 63825 42050</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>keerthivasan3y@gmail.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter / CTA */}
                    <div>
                        <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Need Assistance?</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Our experts are here to help you choose the best purifier.</p>
                        <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'space-between' }}>
                            <span>Consult Now</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #1e293b', paddingTop: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                    <p>© {new Date().getFullYear()} RIDER TECH -ASTRA. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
