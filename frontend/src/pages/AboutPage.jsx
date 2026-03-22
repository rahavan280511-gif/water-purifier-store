import React from 'react';
import { Droplets, Clock, HeartPulse, Award, ShieldCheck, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <section style={{ textAlign: 'center', marginBottom: '4rem', padding: '3rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: '20px' }}>
        <img src="/logo.png" alt="ASTRA Logo" style={{ height: '250px', width: 'auto', marginBottom: '1.5rem' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e3a8a', marginTop: '1rem' }}>RIDER TECH -ASTRA</h1>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ padding: '2rem', background: '#fff', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Clock className="text-blue-600" size={32} />
            <h2 style={{ fontSize: '1.5rem', color: '#1f2937' }}>Our History</h2>
          </div>
          <p style={{ color: '#4b5563', lineHeight: '1.7' }}>
            Established with a commitment to clean water, RIDER TECH -ASTRA has served thousands of homes. We began as a small initiative to provide safe drinking water and have grown into a leading provider of RO, UV, and UF systems.
          </p>
        </div>

        <div style={{ padding: '2rem', background: '#fff', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <HeartPulse className="text-green-600" size={32} />
            <h2 style={{ fontSize: '1.5rem', color: '#1f2937' }}>Our Mission</h2>
          </div>
          <p style={{ color: '#4b5563', lineHeight: '1.7' }}>
            Our mission is to ensure every family has access to pure, safe, and refreshing drinking water. We focus on innovation, quality service, and customer satisfaction to protect your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
