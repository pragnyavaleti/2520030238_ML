import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DistributionBarChart, CorrelationHeatmap } from '../components/Charts';
import { 
  BarChart3, 
  Database, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Table, 
  RefreshCw,
  Droplets,
  Sprout,
  Activity,
  FileSpreadsheet
} from 'lucide-react';

const Dataset = () => {
  const [edaData, setEdaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('yield');

  const fetchEda = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getEdaStats();
      if (res && res.data) {
        setEdaData(res.data);
      } else {
        setEdaData(res);
      }
    } catch (err) {
      setError('Unable to load dataset analytics. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEda();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite', color: 'var(--primary)' }}>
          <RefreshCw size={36} />
        </div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading dataset metrics and generating distributions...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !edaData) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <AlertCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem auto' }} />
        <h3>Failed to Load EDA Dashboard</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={fetchEda} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  const { summary, distributions, correlation_matrix, sample_rows } = edaData;

  const chartTabs = [
    { key: 'yield', label: 'Yield Distribution', color: '#10b981', buckets: distributions.yield, unit: 'tons/ha' },
    { key: 'production', label: 'Production Distribution', color: '#f59e0b', buckets: distributions.production, unit: 'metric tons' },
    { key: 'rainfall', label: 'Annual Rainfall', color: '#0284c7', buckets: distributions.rainfall, unit: 'mm' },
    { key: 'area', label: 'Cultivated Area', color: '#8b5cf6', buckets: distributions.area, unit: 'hectares' },
    { key: 'fertilizer', label: 'Fertilizer Input', color: '#ec4899', buckets: distributions.fertilizer, unit: 'kg' },
    { key: 'pesticide', label: 'Pesticide Application', color: '#ef4444', buckets: distributions.pesticide, unit: 'kg' }
  ];

  const currentTab = chartTabs.find(t => t.key === activeChart) || chartTabs[0];

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-badge">Exploratory Data Analysis</span>
          <h1 className="section-title">Dataset & Statistical Analysis</h1>
          <p className="section-subtitle">
            Deep-dive into agricultural distributions, feature parameters, missing value audits, and cross-variable correlations.
          </p>
        </div>

        {/* Top Summary Cards Grid */}
        <div className="grid-4" style={{ marginBottom: '3rem' }}>
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
              <Database size={22} />
            </div>
            <div>
              <div className="stat-val">{summary.total_records.toLocaleString()}</div>
              <div className="stat-label">Total Records</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-gold-light)', color: 'var(--accent-gold-dark)' }}>
              <Layers size={22} />
            </div>
            <div>
              <div className="stat-val">{summary.features_count}</div>
              <div className="stat-label">Feature Columns</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="stat-val">{summary.missing_values}</div>
              <div className="stat-label">Missing Values (0%)</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#f1f5f9', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="stat-val">{summary.duplicate_values}</div>
              <div className="stat-label">Duplicate Rows</div>
            </div>
          </div>
        </div>

        {/* Dataset Columns Overview */}
        <div className="card" style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSpreadsheet size={20} color="var(--primary)" />
            <span>Dataset Schema & Features</span>
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {summary.columns.map((col) => (
              <span key={col} style={{
                padding: '0.45rem 0.9rem',
                backgroundColor: col === 'Yield' ? '#d1fae5' : '#f1f5f9',
                border: col === 'Yield' ? '1px solid #6ee7b7' : '1px solid #e2e8f0',
                color: col === 'Yield' ? '#065f46' : 'var(--text-main)',
                fontWeight: col === 'Yield' ? 700 : 500,
                borderRadius: '0.5rem',
                fontSize: '0.85rem'
              }}>
                {col} {col === 'Yield' && '🎯 (Target)'}
              </span>
            ))}
          </div>
        </div>

        {/* Visualizations Section: Interactive Tabs */}
        <div className="card" style={{ marginBottom: '3.5rem', padding: '2rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.75rem'
          }}>
            <div>
              <span className="section-badge" style={{ marginBottom: '0.5rem' }}>Frequency Histograms</span>
              <h3 style={{ fontSize: '1.4rem' }}>Feature Distribution Explorer</h3>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {chartTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveChart(tab.key)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '0.5rem',
                    border: activeChart === tab.key ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: activeChart === tab.key ? 'var(--primary-light)' : '#ffffff',
                    color: activeChart === tab.key ? 'var(--primary-dark)' : 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Chart Display */}
          <div style={{ background: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                {currentTab.label} Range Buckets
              </span>
              <span className="badge" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)' }}>
                Unit: {currentTab.unit}
              </span>
            </div>
            <DistributionBarChart
              buckets={currentTab.buckets}
              label={currentTab.label}
              color={currentTab.color}
              unit={currentTab.unit}
            />
          </div>
        </div>

        {/* Correlation Heatmap */}
        <div className="card" style={{ marginBottom: '3.5rem', padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="section-badge" style={{ marginBottom: '0.5rem' }}>Multivariate Analysis</span>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Feature Correlation Matrix</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Pearson correlation coefficients between continuous variables. Strong positive values indicated in dark green.
            </p>
          </div>
          <CorrelationHeatmap matrix={correlation_matrix} />
        </div>

        {/* Raw Dataset Preview Table */}
        {sample_rows && sample_rows.length > 0 && (
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>Dataset Sample Preview</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>First 10 records from crop_yield.csv</p>
              </div>
              <span className="badge badge-info">10 Samples</span>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    {summary.columns.map(col => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sample_rows.map((row, idx) => (
                    <tr key={idx}>
                      {summary.columns.map(col => (
                        <td key={col} style={{ fontWeight: col === 'Yield' ? 700 : 400, color: col === 'Yield' ? 'var(--primary-dark)' : 'inherit' }}>
                          {row[col] !== undefined ? row[col] : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dataset;
