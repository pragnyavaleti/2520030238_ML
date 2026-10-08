import React from 'react';
import { 
  Target, 
  AlertTriangle, 
  Leaf, 
  CloudRain, 
  FlaskConical, 
  Bug, 
  Layers, 
  CheckCircle2, 
  Cpu, 
  Database,
  Server,
  Code
} from 'lucide-react';

const About = () => {
  const factors = [
    {
      title: 'Annual Rainfall & Precipitation',
      icon: CloudRain,
      color: '#0284c7',
      bg: '#e0f2fe',
      desc: 'Adequate and timely rainfall provides essential moisture for root elongation and grain filling. Water deficits cause crop stress, while excessive rainfall can lead to waterlogging.'
    },
    {
      title: 'Chemical Fertilizer Balance',
      icon: FlaskConical,
      color: '#10b981',
      bg: '#d1fae5',
      desc: 'Balanced Nitrogen (N), Phosphorus (P), and Potassium (K) application fuels vigorous vegetative growth, photosynthetic efficiency, and resistance against environmental diseases.'
    },
    {
      title: 'Pesticide & Plant Protection',
      icon: Bug,
      color: '#ef4444',
      bg: '#fee2e2',
      desc: 'Targeted pesticide usage preserves harvest biomass from devastating insect infestations, stem borers, and fungal blights, ensuring optimal yield conversion.'
    },
    {
      title: 'Cultivated Area & Production Scale',
      icon: Leaf,
      color: '#f59e0b',
      bg: '#fef3c7',
      desc: 'The spatial expanse under active cultivation determines mechanized efficiency, crop density, resource distribution, and overall aggregate output.'
    }
  ];

  const technologies = [
    { name: 'React.js 18', role: 'Frontend UI', icon: Code, desc: 'Responsive single-page application with modular components, React Router, and responsive state handling.' },
    { name: 'Chart.js', role: 'Visualizations', icon: Layers, desc: 'Interactive distribution histograms, comparison charts, and matrix visualizers.' },
    { name: 'Node.js & Express', role: 'Backend API Gateway', icon: Server, desc: 'REST API orchestration, request validation, ML service proxy, and security middleware.' },
    { name: 'Firebase Firestore', role: 'NoSQL Database', icon: Database, desc: 'Real-time scalable cloud persistence for prediction inputs, outputs, timestamps, and history.' },
    { name: 'Python FastAPI', role: 'Machine Learning Microservice', icon: Cpu, desc: 'High-performance asynchronous inference server running scikit-learn and XGBoost pipelines.' },
    { name: 'Ensemble ML Models', role: 'Predictive Regressors', icon: Target, desc: 'Random Forest, XGBoost, and Support Vector Regression models trained on agricultural records.' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-badge">Project Background & Methodology</span>
          <h1 className="section-title">About the Crop Yield Prediction Project</h1>
          <p className="section-subtitle">
            Exploring the problem statement, strategic objectives, agronomic factors, and cutting-edge machine learning approach driving agricultural intelligence.
          </p>
        </div>

        {/* Problem Statement & Objectives Grid */}
        <div className="grid-2" style={{ marginBottom: '3.5rem' }}>
          {/* Problem Statement */}
          <div className="card card-hover" style={{ borderLeft: '4px solid #ef4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: '#fee2e2', color: '#dc2626' }}>
                <AlertTriangle size={24} />
              </div>
              <h2 style={{ fontSize: '1.4rem' }}>Problem Statement</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1rem' }}>
              Modern agriculture faces escalating uncertainties triggered by volatile climatic shifts, unpredictable monsoon precipitation cycles, and uneven nutrient dispersion.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
              Without reliable predictive intelligence, farmers suffer catastrophic crop failures or severe profit margins due to miscalculated input investments, while government agencies struggle with grain stockpile planning and supply chain stability.
            </p>
          </div>

          {/* Project Objectives */}
          <div className="card card-hover" style={{ borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: '#d1fae5', color: '#059669' }}>
                <Target size={24} />
              </div>
              <h2 style={{ fontSize: '1.4rem' }}>Project Objectives</h2>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Develop accurate regression models to predict crop yields with greater than 95% statistical confidence.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Benchmark and compare <strong>Random Forest</strong>, <strong>XGBoost</strong>, and <strong>SVR</strong> to identify top-performing regressors.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Persist all real-time predictions securely in <strong>Firebase Firestore</strong> for audit trails and temporal trend analysis.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Provide an accessible, intuitive dashboard for farmers, agronomists, and researchers.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Factors Affecting Crop Yield */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-badge">Key Agronomic Determinants</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Factors Influencing Crop Yield</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
              Our machine learning models incorporate multi-dimensional parameters spanning climate, soil inputs, and geographical factors.
            </p>
          </div>

          <div className="grid-2">
            {factors.map((f, idx) => (
              <div key={idx} className="card card-hover" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: f.bg,
                  color: f.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <f.icon size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Machine Learning Approach */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: '#ffffff',
          padding: '3rem 2.5rem',
          marginBottom: '4rem',
          borderRadius: '1.25rem'
        }}>
          <h2 style={{ color: '#ffffff', fontSize: '1.85rem', fontWeight: 800, marginBottom: '1rem' }}>
            The Machine Learning Methodology
          </h2>
          <p style={{ color: '#d1fae5', fontSize: '1rem', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '800px' }}>
            The pipeline is engineered for high reproducibility, mathematical rigor, and minimal prediction variance across diverse crop typologies.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1.25rem', borderRadius: '0.75rem', backdropFilter: 'blur(6px)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fde68a', marginBottom: '0.25rem' }}>01</div>
              <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '0.4rem' }}>Data Cleansing</h4>
              <p style={{ color: '#d1fae5', fontSize: '0.85rem', lineHeight: '1.5' }}>
                Elimination of duplicate records, median imputation for missing numerical fields, and domain boundary validation.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1.25rem', borderRadius: '0.75rem', backdropFilter: 'blur(6px)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fde68a', marginBottom: '0.25rem' }}>02</div>
              <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '0.4rem' }}>Encoding & Scaling</h4>
              <p style={{ color: '#d1fae5', fontSize: '0.85rem', lineHeight: '1.5' }}>
                Label encoding for State, Crop, Season. StandardScaler normalization for SVR distance metrics.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1.25rem', borderRadius: '0.75rem', backdropFilter: 'blur(6px)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fde68a', marginBottom: '0.25rem' }}>03</div>
              <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '0.4rem' }}>80/20 Train-Test</h4>
              <p style={{ color: '#d1fae5', fontSize: '0.85rem', lineHeight: '1.5' }}>
                Strict partition into 80% training and 20% holdout test data to prevent data leakage and ensure generalized scoring.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1.25rem', borderRadius: '0.75rem', backdropFilter: 'blur(6px)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fde68a', marginBottom: '0.25rem' }}>04</div>
              <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '0.4rem' }}>Multi-Metric Scoring</h4>
              <p style={{ color: '#d1fae5', fontSize: '0.85rem', lineHeight: '1.5' }}>
                Benchmarked using Mean Absolute Error (MAE), Mean Squared Error (MSE), Root Mean Squared Error (RMSE), and R² Score.
              </p>
            </div>
          </div>
        </div>

        {/* Technologies Used Grid */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-badge">Architecture & Tooling</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Technologies Used in the Project</h2>
          </div>

          <div className="grid-3">
            {technologies.map((tech, idx) => (
              <div key={idx} className="card card-hover">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
                    <tech.icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>{tech.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{tech.role}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
