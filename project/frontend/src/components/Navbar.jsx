import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Sprout, 
  BarChart3, 
  Cpu, 
  Scale, 
  Sparkles, 
  History, 
  Info, 
  Menu, 
  X 
} from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: <Sprout size={18} /> },
    { to: '/about', label: 'About', icon: <Info size={18} /> },
    { to: '/dataset', label: 'Dataset & EDA', icon: <BarChart3 size={18} /> },
    { to: '/models', label: 'ML Models', icon: <Cpu size={18} /> },
    { to: '/compare', label: 'Comparison', icon: <Scale size={18} /> },
    { to: '/history', label: 'History', icon: <History size={18} /> },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'var(--transition)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.5rem'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            color: '#ffffff',
            padding: '0.6rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
          }}>
            <Sprout size={24} strokeWidth={2.4} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              display: 'block',
              lineHeight: 1.1
            }}>
              Crop<span style={{ color: 'var(--primary)' }}>Yield</span>
            </span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              ML Precision Ag
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }} className="desktop-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive ? 'var(--primary-dark)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                transition: 'var(--transition)'
              })}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/predict" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
            <Sparkles size={16} />
            <span>Predict Yield</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-main)',
              padding: '0.5rem'
            }}
            className="mobile-toggle"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          borderTop: '1px solid var(--border-color)',
          backgroundColor: '#ffffff',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: isActive ? 'var(--primary-dark)' : 'var(--text-main)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent'
              })}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      )}

      {/* Inline Responsive CSS helper */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
