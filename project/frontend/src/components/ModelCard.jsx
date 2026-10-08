import React from 'react';
import { Award, CheckCircle2, TrendingUp, Zap, HelpCircle, Layers } from 'lucide-react';

const ModelCard = ({
  name,
  isBest = false,
  description,
  howItWorks,
  advantages = [],
  metrics = {},
  icon: Icon = Layers,
  tagColor = '#10b981'
}) => {
  return (
    <div className={`card ${isBest ? 'animate-pulse-glow' : 'card-hover'}`} style={{
      position: 'relative',
      border: isBest ? '2px solid #f59e0b' : '1px solid var(--border-color)',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Best Model Badge */}
      {isBest && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          right: '20px',
          backgroundColor: '#f59e0b',
          color: '#ffffff',
          padding: '0.3rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          boxShadow: '0 4px 10px rgba(245, 158, 11, 0.4)',
          letterSpacing: '0.04em'
        }}>
          <Award size={14} />
          <span>TOP PERFORMER</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: `${tagColor}15`,
          color: tagColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>{name}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Supervised Machine Learning Regressor
          </span>
        </div>
      </div>

      {/* Performance Metrics Pills */}
      {metrics && metrics.r2_score !== undefined && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-card-subtle)',
          padding: '0.75rem',
          borderRadius: '0.625rem',
          marginBottom: '1.25rem',
          textAlign: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>R² Score</span>
            <span style={{ fontWeight: 800, color: 'var(--primary-dark)', fontSize: '0.95rem' }}>
              {(metrics.r2_score * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>RMSE</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
              {metrics.rmse}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>MAE</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
              {metrics.mae}
            </span>
          </div>
        </div>
      )}

      {/* Content Section: What it is */}
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
          What It Is
        </h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
          {description}
        </p>
      </div>

      {/* Content Section: How it works */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
          How It Works
        </h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
          {howItWorks}
        </p>
      </div>

      {/* Advantages */}
      <div style={{ marginTop: 'auto' }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          Key Advantages
        </h4>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {advantages.map((adv, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{adv}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ModelCard;
