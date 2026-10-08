import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Sparkles, 
  ArrowRight, 
  BarChart3, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Award, 
  TrendingUp, 
  Droplets,
  Sun,
  Wheat
} from 'lucide-react';

const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 4rem 0',
        background: 'linear-gradient(180deg, rgba(209, 250, 229, 0.4) 0%, rgba(248, 250, 252, 0) 100%)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* Badge */}
          <div className="section-badge animate-pulse-glow" style={{ margin: '0 auto 1.5rem auto' }}>
            <Sparkles size={16} />
            <span>AI-Powered Precision Agriculture Platform</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            maxWidth: '900px',
            margin: '0 auto 1.25rem auto'
          }}>
            Crop Yield Prediction Using <br />
            <span style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Machine Learning
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            maxWidth: '720px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6
          }}>
            Harnessing state-of-the-art ensemble learning and regression algorithms to forecast agricultural crop yields with high accuracy, optimizing resource allocation and safeguarding food security.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/predict" className="btn btn-primary btn-lg">
              <Sparkles size={18} />
              <span>Predict Crop Yield</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/compare" className="btn btn-secondary btn-lg">
              <BarChart3 size={18} />
              <span>Compare Models</span>
            </Link>
          </div>

          {/* Key Metrics Ribbon */}
          <div style={{
            marginTop: '3.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            maxWidth: '1000px',
            margin: '3.5rem auto 0 auto'
          }}>
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
                <Cpu size={24} />
              </div>
              <div>
                <div className="stat-val">3 ML</div>
                <div className="stat-label">Trained Regressors</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-gold-light)', color: 'var(--accent-gold-dark)' }}>
                <Award size={24} />
              </div>
              <div>
                <div className="stat-val">98.1%</div>
                <div className="stat-label">Peak R² Accuracy</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-sky-light)', color: 'var(--accent-sky)' }}>
                <Wheat size={24} />
              </div>
              <div>
                <div className="stat-val">1,250+</div>
                <div className="stat-label">Agronomic Records</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="stat-val">100%</div>
                <div className="stat-label">Cloud Firestore Logged</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Crop Yield Prediction Section */}
      <section className="section" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <span className="section-badge">Agronomic Intelligence</span>
              <h2 className="section-title">What is Crop Yield Prediction?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                Crop yield prediction is the practice of estimating the expected harvest quantity per unit of cultivated area (metric tons per hectare) prior to actual harvest.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.75rem' }}>
                Historically, farming relied upon traditional intuitive forecasting which is increasingly vulnerable to shifting precipitation cycles and temperature anomalies. Our multi-layer solution merges historical agronomic data, chemical inputs, and environmental factors with supervised machine learning to deliver dependable predictive forecasts.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Droplets size={16} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Optimizes Irrigation & Hydrological Scheduling</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Sun size={16} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Mitigates Climate Risk & Monsoon Fluctuations</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <TrendingUp size={16} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Guides Fertilizer and Crop Protection Investments</span>
                </div>
              </div>
            </div>

            {/* Visual Feature Card */}
            <div className="card card-glass" style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)',
              border: '1px solid #a7f3d0',
              padding: '2.5rem'
            }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={22} color="var(--primary)" />
                <span>Importance of ML in Agriculture</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Machine Learning models analyze complex non-linear relationships across multi-dimensional parameters that simple statistical averages cannot capture:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '0.625rem', border: '1px solid #e2e8f0' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.9rem' }}>1. Precision Input Allocation</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Prevents over-fertilization, lowering production costs and preserving soil ecology.</span>
                </div>
                <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '0.625rem', border: '1px solid #e2e8f0' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.9rem' }}>2. Market Price & Food Security Planning</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Empowers policy makers and agricultural banks to predict yield shortfalls months in advance.</span>
                </div>
                <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '0.625rem', border: '1px solid #e2e8f0' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.9rem' }}>3. Data-Driven Advisory</strong>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Translates historical meteorological trends into actionable sowing guidelines.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ML Models Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Supervised Learning Ensemble</span>
            <h2 className="section-title">The Three Machine Learning Regressors</h2>
            <p className="section-subtitle">
              Our architecture benchmarks three distinct algorithmic paradigms to deliver accurate and robust yield projections.
            </p>
          </div>

          <div className="grid-3">
            {/* Random Forest */}
            <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Random Forest Regressor</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                An ensemble meta-estimator that constructs hundreds of decorrelated decision trees during training and averages their outputs, preventing overfitting.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <span className="badge badge-success">R²: 97.6% • MAE: 0.21</span>
              </div>
            </div>

            {/* XGBoost */}
            <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', border: '2px solid #f59e0b' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Award size={24} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>XGBoost Regressor</h3>
                <span className="badge badge-best">Top Model</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Extreme Gradient Boosting algorithm that iteratively builds sequential trees to minimize residual errors via second-order Taylor expansion and regularized loss.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <span className="badge badge-best">R²: 98.1% • MAE: 0.18</span>
              </div>
            </div>

            {/* SVR */}
            <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(2, 132, 199, 0.1)',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Support Vector Regression (SVR)</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Finds an optimal hyperplane within a continuous-valued margin tolerance (ε-tube) using Radial Basis Function (RBF) kernels to map non-linear agricultural features.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <span className="badge badge-info">R²: 93.7% • MAE: 0.36</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
        color: '#ffffff',
        padding: '4.5rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ color: '#ffffff', fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to Predict Crop Yields?
          </h2>
          <p style={{ color: '#d1fae5', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Enter your crop, state, rainfall, and fertilizer metrics into our interactive prediction dashboard and get instant machine learning predictions.
          </p>
          <Link to="/predict" className="btn btn-accent btn-lg" style={{ boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)' }}>
            <Sparkles size={20} />
            <span>Launch Prediction Tool</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
