import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Wrench, Menu, UserCircle, LogOut, LogIn, X, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const NavLinks = () => (
    <>
      <li>
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/service" className={`nav-link ${isActive('/service') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
          Service Request
        </Link>
      </li>
      {isAuthenticated && role === 'admin' && (
        <li>
          <Link to="/admin/history" className={`nav-link ${isActive('/admin/history') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} />
              <span>History</span>
            </div>
          </Link>
        </li>
      )}
      <li>
        <Link 
          to="/contact" 
          className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
          onClick={() => setIsOpen(false)}
        >
          Contact
        </Link>
      </li>
    </>
  );

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo" onClick={() => setIsOpen(false)}>
            <img src="/logo.png" alt="ASTRA Logo" style={{ height: '50px', width: 'auto' }} />
            <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1e3a8a' }}>RIDER TECH -ASTRA</span>
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links">
            <NavLinks />
          </ul>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="desktop-only" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {isAuthenticated && role === 'admin' ? (
                <>
                  <Link to="/admin" className={`btn ${isActive('/admin') ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 1rem' }}>
                    <UserCircle size={20} />
                    <span>Admin</span>
                  </Link>
                  <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', borderColor: '#ef4444', color: '#ef4444' }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className={`btn ${isActive('/login') ? 'btn-primary' : 'btn-outline'}`} style={{ padding: '0.5rem 1rem' }}>
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button 
              className="mobile-toggle" 
              onClick={() => setIsOpen(!isOpen)}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '0.5rem' }}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fade-in" style={{
          position: 'fixed',
          top: '4.5rem',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'white',
          zIndex: 40,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.2rem' }}>
            <NavLinks />
          </ul>
          
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isAuthenticated && role === 'admin' ? (
              <>
                <Link to="/admin" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={() => setIsOpen(false)}>
                  <UserCircle size={20} />
                  <span>Admin Panel</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', padding: '1rem', color: '#ef4444', borderColor: '#ef4444' }}>
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={() => setIsOpen(false)}>
                <LogIn size={20} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .mobile-toggle { display: none; }
          .desktop-only { display: flex; }
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .desktop-only { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
