import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MetricComparisonChart } from '../components/Charts';
import { 
  Award, 
  Scale, 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle, 
  BarChart2, 
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ModelComparison = () => {
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await api.getModelResults();
        setModelData(res.data || res);
      } catch (err) {
        console.warn('Failed to load live results, using default benchmarks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // Fallback defaults if not yet loaded (sourced from model_results.json)
  const defaultModels = [
    { model_name: 'XGBoost', mae: 9.0894, mse: 10925.8911, rmse: 104.527, r2_score: 0.9877 },
    { model_name: 'Random Forest', mae: 8.3927, mse: 14414.3812, rmse: 120.0599, r2_score: 0.9838 },
    { model_name: 'Support Vector Regression (SVR)', mae: 28.0784, mse: 168875.6644, rmse: 410.9448, r2_score: 0.8102 }
  ];

  const models = (modelData && modelData.models) ? modelData.models : defaultModels;
  const bestModelInfo = (modelData && modelData.best_model) ? modelData.best_model : {
    best_model_name: 'XGBoost',
    reason: 'Achieved highest R\u00b2 score of 0.9877 (98.77%) and lowest RMSE of 104.527 on 4,350 test samples from crop_yield_test(6).csv.'
  };

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-badge">Model Benchmark & Evaluation</span>
          <h1 className="section-title">Machine Learning Model Comparison</h1>
          <p className="section-subtitle">
            Side-by-side performance evaluation of Random Forest, XGBoost, and SVR on 20% holdout test data across MAE, MSE, RMSE, and R² Score.
          </p>
        </div>

        {/* 🏆 Best Performing Model Highlight Banner */}
        <div className="card animate-pulse-glow" style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 50%, #fef3c7 100%)',
          border: '2px solid #f59e0b',
          padding: '2.25rem',
          borderRadius: '1.25rem',
          marginBottom: '3rem',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(245, 158, 11, 0.4)',
                flexShrink: 0
              }}>
                <Award size={36} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-best">🏆 TOP PERFORMING MODEL</span>
                  <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>Default Inference Regressor</span>
                </div>
                <h2 style={{ fontSize: '1.85rem', color: '#78350f', fontWeight: 800 }}>
                  {bestModelInfo.best_model_name} Regressor
                </h2>
                <p style={{ color: '#92400e', fontSize: '0.95rem', maxWidth: '650px', marginTop: '0.25rem', lineHeight: 1.5 }}>
                  {bestModelInfo.reason}
                </p>
              </div>
            </div>

            <Link to="/predict" className="btn btn-accent" style={{ padding: '0.75rem 1.5rem' }}>
              <Sparkles size={18} />
              <span>Predict With Best Model</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Model Metrics Comparison Table */}
        <div className="card" style={{ marginBottom: '3.5rem', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>Comprehensive Performance Table</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Holdout Test Set (80:20 Split — 4,350 Test Records from crop_yield_test(6).csv)</p>
            </div>
            <span className="badge badge-success">80% Train / 20% Test</span>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model Name</th>
                  <th>Mean Absolute Error (MAE) ↓</th>
                  <th>Mean Squared Error (MSE) ↓</th>
                  <th>Root Mean Squared Error (RMSE) ↓</th>
                  <th>R² Score (Coefficient of Determination) ↑</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => {
                  const isBest = m.model_name.toLowerCase().includes(bestModelInfo.best_model_name.toLowerCase());
                  return (
                    <tr key={m.model_name} style={{ backgroundColor: isBest ? 'rgba(245, 158, 11, 0.06)' : 'inherit' }}>
                      <td style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isBest && <Award size={16} color="#f59e0b" />}
                        <span>{m.model_name}</span>
                      </td>
                      <td style={{ fontWeight: isBest ? 700 : 500, color: isBest ? '#065f46' : 'inherit' }}>
                        {m.mae}
                      </td>
                      <td style={{ fontWeight: isBest ? 700 : 500, color: isBest ? '#065f46' : 'inherit' }}>
                        {m.mse}
                      </td>
                      <td style={{ fontWeight: isBest ? 700 : 500, color: isBest ? '#065f46' : 'inherit' }}>
                        {m.rmse}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ color: isBest ? '#059669' : 'var(--text-main)' }}>
                            {(m.r2_score * 100).toFixed(1)}%
                          </strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({m.r2_score})</span>
                        </div>
                      </td>
                      <td>
                        {isBest ? (
                          <span className="badge badge-best">Best Performer</span>
                        ) : (
                          <span className="badge badge-info">Evaluated</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4 Interactive Metric Comparison Charts */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-badge">Comparative Visualizations</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Metric Comparison Visualizations</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Lower is better for error metrics (MAE, MSE, RMSE); Higher is better for R² Score.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '2rem' }}>
            {/* 1. MAE Comparison Chart */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem' }}>Mean Absolute Error (MAE)</h4>
                <span className="badge badge-warning">Lower is Better</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Measures the average magnitude of absolute errors between predicted and observed yield.
              </p>
              <MetricComparisonChart models={models} metricKey="mae" metricTitle="MAE" higherIsBetter={false} />
            </div>

            {/* 2. MSE Comparison Chart */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem' }}>Mean Squared Error (MSE)</h4>
                <span className="badge badge-warning">Lower is Better</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Penalizes larger outliers more severely by squaring prediction residuals.
              </p>
              <MetricComparisonChart models={models} metricKey="mse" metricTitle="MSE" higherIsBetter={false} />
            </div>

            {/* 3. RMSE Comparison Chart */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem' }}>Root Mean Squared Error (RMSE)</h4>
                <span className="badge badge-warning">Lower is Better</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Standard deviation of residuals, expressed in identical units (tons/hectare).
              </p>
              <MetricComparisonChart models={models} metricKey="rmse" metricTitle="RMSE" higherIsBetter={false} />
            </div>

            {/* 4. R2 Score Comparison Chart */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem' }}>R² Score (Variance Explained)</h4>
                <span className="badge badge-success">Higher is Better</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Proportion of variance in crop yield predictable from input agronomic features.
              </p>
              <MetricComparisonChart models={models} metricKey="r2_score" metricTitle="R² Score" higherIsBetter={true} />
            </div>
          </div>
        </div>

        {/* Analytical Rationale Accordion / Card */}
        <div className="card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={20} color="var(--primary)" />
            <span>Why Did {bestModelInfo.best_model_name} Win the Benchmark?</span>
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '1rem' }}>
            XGBoost demonstrated superior convergence by iteratively fitting trees to second-order Taylor gradients of the squared error loss function. In agricultural datasets where rainfall and fertilizer curves exhibit subtle saturation thresholds, gradient boosted trees establish refined piece-wise linear partitions compared to unweighted bagging in Random Forest or global hyperspherical approximations in SVR.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-success">Highest R²: 98.77% (4,350 test samples)</span>
            <span className="badge badge-info">Collinear Feature Robustness</span>
            <span className="badge badge-warning">L1/L2 Shrinkage Regularization</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelComparison;
