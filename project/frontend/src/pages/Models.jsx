import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ModelCard from '../components/ModelCard';
import { Layers, Award, Cpu, Sparkles, BookOpen } from 'lucide-react';

const Models = () => {
  const [modelResults, setModelResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.getModelResults();
        setModelResults(res.data || res);
      } catch (err) {
        console.warn('Could not fetch model results for metrics display:', err.message);
      }
    };
    fetchResults();
  }, []);

  const getMetrics = (name) => {
    if (!modelResults || !modelResults.models) return {};
    const found = modelResults.models.find(m => m.model_name.toLowerCase().includes(name.toLowerCase()));
    return found || {};
  };

  const modelsData = [
    {
      name: 'Random Forest Regressor',
      isBest: false,
      icon: Layers,
      tagColor: '#10b981',
      description: 'Random Forest is a bagging ensemble meta-estimator that fits multiple decision trees on various sub-samples of the agricultural dataset. It constructs orthogonal hyperplanes and averages tree predictions to improve predictive accuracy and control over-fitting.',
      howItWorks: 'During training, Bootstrap Aggregating (Bagging) generates hundreds of distinct subsets of the 1,250 historical records with replacement. Each decision tree splits nodes on a random subset of agronomic features (Rainfall, Fertilizer, Area, etc.). Final yield is computed as the arithmetic mean of all individual tree predictions.',
      advantages: [
        'Robust to outliers and noisy weather sensor readings.',
        'High resistance to overfitting through ensemble averaging.',
        'Computes inherent Gini importance for feature impact analysis.',
        'Handles both non-linear continuous and encoded categorical features seamlessly.'
      ],
      metrics: getMetrics('Random Forest')
    },
    {
      name: 'XGBoost Regressor',
      isBest: true,
      icon: Award,
      tagColor: '#f59e0b',
      description: 'Extreme Gradient Boosting (XGBoost) is an advanced implementation of gradient boosted decision trees engineered for state-of-the-art predictive performance, computational speed, and built-in L1/L2 regularization to prevent overfitting.',
      howItWorks: 'Unlike bagging which builds trees in parallel, XGBoost constructs trees sequentially. Each subsequent tree fits directly onto the pseudo-residuals (gradients) of previous iterations using second-order Taylor expansion approximations of the loss function, steadily reducing prediction errors across complex regional yield variances.',
      advantages: [
        'Achieved the highest R\u00b2 Score (98.77%) and lowest RMSE (104.527) on 4,350 holdout test samples.',
        'Built-in L1 (Lasso) and L2 (Ridge) regularization guards against excessive leaf complexity.',
        'Cache-aware block structure enables ultra-fast training and inference.',
        'Optimal handling of multi-dimensional feature collinearities.'
      ],
      metrics: getMetrics('XGBoost')
    },
    {
      name: 'Support Vector Regression (SVR)',
      isBest: false,
      icon: Cpu,
      tagColor: '#0284c7',
      description: 'Support Vector Regression (SVR) adapts Vapnik’s Support Vector Machine formulation to continuous regression. It determines an optimal separating hyperplane that envelopes the maximum number of data points within an ε-insensitive boundary tube.',
      howItWorks: 'SVR maps non-linear agricultural features into an infinite-dimensional Hilbert feature space utilizing the Radial Basis Function (RBF) kernel: K(x, x\') = exp(-γ ||x - x\'||²). Errors within the ε-threshold incur zero penalty, while deviations beyond ε are penalized proportionally via slack variables (C parameter).',
      advantages: [
        'Global optimum guarantee via convex quadratic optimization.',
        'Excellent generalization ability in dense multidimensional spaces.',
        'Mathematically robust to local perturbations within the ε-tube.',
        'Effective when calibrated with StandardScaler normalization.'
      ],
      metrics: getMetrics('Support Vector')
    }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-badge">Algorithmic Architectures</span>
          <h1 className="section-title">Machine Learning Models</h1>
          <p className="section-subtitle">
            Comprehensive breakdown of the three supervised learning algorithms powering crop yield predictions: mechanics, mathematical foundations, and strengths.
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid-3" style={{ marginBottom: '4rem' }}>
          {modelsData.map((model, idx) => (
            <ModelCard key={idx} {...model} />
          ))}
        </div>

        {/* Mathematical Comparison Infobox */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          padding: '2.5rem',
          border: '1px solid #cbd5e1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <BookOpen size={24} color="var(--primary)" />
            <h3 style={{ fontSize: '1.35rem' }}>Why Multiple Models?</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            In agricultural data science, no single algorithm dominates across all climatic zones and crop types (the <em>No Free Lunch Theorem</em>). While <strong>XGBoost</strong> excels at capturing subtle non-linear interactions between fertilizer and rainfall curves, <strong>Random Forest</strong> provides immense stability against missing sensory reports, and <strong>SVR</strong> offers an alternative hyperplane-margin perspective that is less susceptible to dataset imbalance.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="badge" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: 'var(--text-main)', padding: '0.5rem 1rem' }}>
              Bagging vs Boosting Comparison
            </span>
            <span className="badge" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: 'var(--text-main)', padding: '0.5rem 1rem' }}>
              Kernel Trick in Agronomy
            </span>
            <span className="badge" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: 'var(--text-main)', padding: '0.5rem 1rem' }}>
              Cross-Validated Resilience
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Models;
