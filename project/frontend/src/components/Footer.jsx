import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Database, Cpu, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#94a3b8',
      borderTop: '1px solid #1e293b',
      padding: '4rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                color: '#ffffff',
                padding: '0.5rem',
                borderRadius: '0.625rem',
                display: 'flex'
              }}>
                <Sprout size={20} />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.3rem',
                color: '#ffffff'
              }}>
                Crop<span style={{ color: '#10b981' }}>Yield</span> AI
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Empowering sustainable agriculture through predictive machine learning models. Built to optimize crop yields and mitigate climate risks.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span className="badge" style={{ background: '#1e293b', color: '#10b981', border: '1px solid #334155' }}>
                <Cpu size={12} /> ML Pipeline
              </span>
              <span className="badge" style={{ background: '#1e293b', color: '#f59e0b', border: '1px solid #334155' }}>
                <Database size={12} /> Firestore
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem' }}>Platform Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: '#94a3b8', transition: 'var(--transition)' }} onMouseEnter={e => e.target.style.color='#10b981'} onMouseLeave={e => e.target.style.color='#94a3b8'}>Home Overview</Link></li>
              <li><Link to="/about" style={{ color: '#94a3b8', transition: 'var(--transition)' }} onMouseEnter={e => e.target.style.color='#10b981'} onMouseLeave={e => e.target.style.color='#94a3b8'}>Project Background</Link></li>
              <li><Link to="/dataset" style={{ color: '#94a3b8', transition: 'var(--transition)' }} onMouseEnter={e => e.target.style.color='#10b981'} onMouseLeave={e => e.target.style.color='#94a3b8'}>Dataset & EDA</Link></li>
              <li><Link to="/models" style={{ color: '#94a3b8', transition: 'var(--transition)' }} onMouseEnter={e => e.target.style.color='#10b981'} onMouseLeave={e => e.target.style.color='#94a3b8'}>ML Architecture</Link></li>
              <li><Link to="/compare" style={{ color: '#94a3b8', transition: 'var(--transition)' }} onMouseEnter={e => e.target.style.color='#10b981'} onMouseLeave={e => e.target.style.color='#94a3b8'}>Model Benchmark</Link></li>
            </ul>
          </div>

          {/* Machine Learning Models */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem' }}>Active Algorithms</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                Random Forest Regressor
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
                XGBoost Regressor (Best)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }}></span>
                Support Vector Regression (SVR)
              </li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem' }}>Multi-Layer Tech Stack</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem' }}>
              {['React.js', 'Node.js', 'Express.js', 'Python FastAPI', 'Firestore', 'Scikit-learn', 'XGBoost', 'Chart.js'].map(tech => (
                <span key={tech} style={{
                  padding: '0.3rem 0.65rem',
                  background: '#1e293b',
                  color: '#cbd5e1',
                  borderRadius: '0.375rem',
                  border: '1px solid #334155'
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem'
        }}>
          <div>
            © {new Date().getFullYear()} Crop Yield Prediction Using Machine Learning. Multi-Layer Enterprise Architecture.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Built for Precision Agriculture</span>
            <ShieldCheck size={16} color="#10b981" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
