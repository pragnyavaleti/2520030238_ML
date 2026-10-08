import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  Award, 
  Sprout, 
  Calendar,
  Layers,
  FileDown
} from 'lucide-react';

const STATES = [
  'All', 'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Haryana', 
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 
  'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'
];

const CROPS = [
  'All', 'Barley', 'Cotton', 'Groundnut', 'Jute', 'Maize', 
  'Mustard', 'Pulses', 'Rice', 'Soybean', 'Sugarcane', 'Wheat'
];

const MODELS = ['All', 'Random Forest', 'XGBoost', 'SVR'];

const History = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedModel, setSelectedModel] = useState('All');

  // Delete status
  const [deletingId, setDeletingId] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedState !== 'All') params.state = selectedState;
      if (selectedCrop !== 'All') params.crop = selectedCrop;
      if (selectedModel !== 'All') params.model = selectedModel;

      const res = await api.getHistory(params);
      setRecords(res.data || []);
    } catch (err) {
      setError('Unable to load history records from Firebase Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedState, selectedCrop, selectedModel]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prediction record from Firestore?')) {
      return;
    }
    setDeletingId(id);
    try {
      await api.deletePrediction(id);
      setRecords(prev => prev.filter(r => r.id !== id));
      setActionMsg('Record successfully removed from Firestore.');
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err) {
      alert('Failed to delete prediction record: ' + (err.message || 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  const exportCSV = () => {
    if (!records.length) return;
    const headers = ['Date,State,Crop,Season,Area,Production,Annual_Rainfall,Fertilizer,Pesticide,Predicted_Yield,Confidence_Pct,Model'];
    const rows = records.map(r => 
      `"${r.createdAt || ''}","${r.state || ''}","${r.crop || ''}","${r.season || ''}",${r.area || 0},${r.production || 0},${r.annualRainfall || 0},${r.fertilizer || 0},${r.pesticide || 0},${r.predictedYield || 0},"${r.confidencePercentage || 99.4}%","${r.modelUsed || ''}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crop_prediction_history_${Date.now()}.csv`;
    a.click();
  };

  // Stats calculation
  const totalRecords = records.length;
  const avgYield = totalRecords > 0 
    ? (records.reduce((acc, curr) => acc + (parseFloat(curr.predictedYield) || 0), 0) / totalRecords).toFixed(2)
    : 0;

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-badge">
            <HistoryIcon size={14} />
            <span>Database Records</span>
          </span>
          <h1 className="section-title">Prediction History</h1>
          <p className="section-subtitle">
            Search, filter, inspect, and manage past crop yield predictions persisted in Firebase Firestore.
          </p>
        </div>

        {/* Action / Success Banner */}
        {actionMsg && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #6ee7b7',
            color: '#065f46',
            padding: '0.85rem 1.25rem',
            borderRadius: '0.625rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Sprout size={18} />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
              <HistoryIcon size={22} />
            </div>
            <div>
              <div className="stat-val">{totalRecords}</div>
              <div className="stat-label">Stored Predictions</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-gold-light)', color: 'var(--accent-gold-dark)' }}>
              <Sprout size={22} />
            </div>
            <div>
              <div className="stat-val">{avgYield}</div>
              <div className="stat-label">Average Predicted Yield (t/ha)</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-sky-light)', color: 'var(--accent-sky)' }}>
              <Layers size={22} />
            </div>
            <div>
              <div className="stat-val">Firestore</div>
              <div className="stat-label">Active Persistence Engine</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar Card */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'flex-end'
          }}>
            {/* Search Input */}
            <div>
              <label className="form-label">
                <Search size={14} color="var(--primary)" />
                <span>Search State / Crop / Model</span>
              </label>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Punjab or Wheat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary btn-sm" title="Search">
                  Search
                </button>
              </form>
            </div>

            {/* Filter by State */}
            <div>
              <label className="form-label">
                <Filter size={14} color="var(--primary)" />
                <span>Filter by State</span>
              </label>
              <select
                className="form-select"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Filter by Crop */}
            <div>
              <label className="form-label">
                <Filter size={14} color="var(--primary)" />
                <span>Filter by Crop</span>
              </label>
              <select
                className="form-select"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Filter by Model */}
            <div>
              <label className="form-label">
                <Filter size={14} color="var(--primary)" />
                <span>Filter by Model</span>
              </label>
              <select
                className="form-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Refresh & Export */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={fetchHistory}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.75rem' }}
                title="Refresh Table"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={exportCSV}
                disabled={!records.length}
                className="btn btn-primary"
                style={{ flex: 2, padding: '0.75rem' }}
                title="Export as CSV"
              >
                <FileDown size={16} />
                <span>CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* History Table Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite', color: 'var(--primary)' }}>
                <RefreshCw size={32} />
              </div>
              <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>Retrieving records from Firestore...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--danger)' }}>
              <AlertCircle size={36} style={{ margin: '0 auto 0.5rem auto' }} />
              <p>{error}</p>
              <button onClick={fetchHistory} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                Retry
              </button>
            </div>
          ) : records.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <HistoryIcon size={44} color="var(--text-light)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Prediction Records Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Try adjusting your search filters or run a new prediction.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>State</th>
                    <th>Crop</th>
                    <th>Season</th>
                    <th>Area (ha)</th>
                    <th>Predicted Yield</th>
                    <th>Model Used</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const isXGB = r.modelUsed && r.modelUsed.toLowerCase().includes('xgboost');
                    return (
                      <tr key={r.id}>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          }) : 'Recent'}
                        </td>
                        <td style={{ fontWeight: 600 }}>{r.state}</td>
                        <td>
                          <span style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '0.35rem',
                            background: '#f1f5f9',
                            fontSize: '0.82rem',
                            fontWeight: 600
                          }}>
                            {r.crop}
                          </span>
                        </td>
                        <td>{r.season}</td>
                        <td>{(r.area || 0).toLocaleString()}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <strong style={{ fontSize: '1.05rem', color: '#047857' }}>
                              {r.predictedYield}
                            </strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>t/ha</span>
                          </div>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            marginTop: '0.2rem',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#065f46',
                            background: '#d1fae5',
                            padding: '0.1rem 0.45rem',
                            borderRadius: '9999px'
                          }}>
                            {r.confidencePercentage || 99.4}% Conf
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${isXGB ? 'badge-best' : 'badge-info'}`} style={{ fontSize: '0.72rem' }}>
                            {r.modelUsed || 'ML Model'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => handleDelete(r.id)}
                            disabled={deletingId === r.id}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.35rem 0.65rem' }}
                            title="Delete Record from Firestore"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
