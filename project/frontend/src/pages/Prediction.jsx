import React, { useState } from 'react';
import { api } from '../services/api';
import PredictionResultModal from '../components/PredictionResultModal';
import {
  Sprout,
  Sparkles,
  MapPin,
  Wheat,
  Calendar,
  CloudRain,
  FlaskConical,
  Bug,
  Maximize2,
  Package,
  RefreshCw,
  AlertCircle,
  Award,
  Cpu,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Trophy,
  Zap
} from 'lucide-react';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal'
];

const CROPS = [
  'Arecanut', 'Arhar/Tur', 'Bajra', 'Banana', 'Barley',
  'Black pepper', 'Cardamom', 'Cashewnut', 'Castor seed', 'Coconut',
  'Coriander', 'Cotton(lint)', 'Cowpea(Lobia)', 'Dry chillies', 'Garlic',
  'Ginger', 'Gram', 'Grapes', 'Groundnut', 'Guar seed',
  'Horse-gram', 'Jowar', 'Jute', 'Khesari', 'Lentil',
  'Linseed', 'Maize', 'Mango', 'Masoor', 'Mesta',
  'Moong', 'Moong(Green Gram)', 'Moth', 'Mustard', 'Niger seed',
  'Oilseeds total', 'Onion', 'Other  Rabi pulses', 'Other Cereals', 'Other Kharif pulses',
  'Other Summer Pulses', 'Peas & beans (Pulses)', 'Potato', 'Ragi', 'Rapeseed &Mustard',
  'Rice', 'Rubber', 'Safflower', 'Sannhamp', 'Sesamum',
  'Small millets', 'Soyabean', 'Sugarcane', 'Sunflower', 'Sweet potato',
  'Tapioca', 'Tobacco', 'Tomato', 'Turmeric', 'Urad',
  'Wheat', 'other oilseeds'
];

const SEASONS = ['Autumn', 'Kharif', 'Rabi', 'Summer', 'Whole Year', 'Winter'];

const SAMPLE_PRESETS = [
  {
    label: 'Punjab Wheat (Rabi)',
    year: '2023',
    state: 'Punjab',
    crop: 'Wheat',
    season: 'Rabi',
    area: '2500',
    production: '10500',
    annualRainfall: '650',
    fertilizer: '280000',
    pesticide: '20000'
  },
  {
    label: 'West Bengal Rice (Kharif)',
    year: '2022',
    state: 'West Bengal',
    crop: 'Rice',
    season: 'Kharif',
    area: '3200',
    production: '12160',
    annualRainfall: '1650',
    fertilizer: '350000',
    pesticide: '26000'
  },
  {
    label: 'Maharashtra Sugarcane (Whole Year)',
    year: '2023',
    state: 'Maharashtra',
    crop: 'Sugarcane',
    season: 'Whole Year',
    area: '1800',
    production: '129600',
    annualRainfall: '1100',
    fertilizer: '420000',
    pesticide: '32000'
  },
  {
    label: 'Gujarat Cotton (Kharif)',
    year: '2021',
    state: 'Gujarat',
    crop: 'Cotton(lint)',
    season: 'Kharif',
    area: '4000',
    production: '8400',
    annualRainfall: '820',
    fertilizer: '320000',
    pesticide: '28000'
  },
  {
    label: 'Madhya Pradesh Soyabean (Kharif)',
    year: '2022',
    state: 'Madhya Pradesh',
    crop: 'Soyabean',
    season: 'Kharif',
    area: '3500',
    production: '8400',
    annualRainfall: '1050',
    fertilizer: '260000',
    pesticide: '21000'
  },
  {
    label: 'Rajasthan Mustard (Rabi)',
    year: '2023',
    state: 'Rajasthan',
    crop: 'Mustard',
    season: 'Rabi',
    area: '2800',
    production: '4480',
    annualRainfall: '480',
    fertilizer: '140000',
    pesticide: '12000'
  },
  {
    label: 'Karnataka Maize (Kharif)',
    year: '2022',
    state: 'Karnataka',
    crop: 'Maize',
    season: 'Kharif',
    area: '2200',
    production: '7040',
    annualRainfall: '1150',
    fertilizer: '240000',
    pesticide: '18000'
  },
  {
    label: 'Tamil Nadu Groundnut (Rabi)',
    year: '2023',
    state: 'Tamil Nadu',
    crop: 'Groundnut',
    season: 'Rabi',
    area: '1900',
    production: '3800',
    annualRainfall: '960',
    fertilizer: '210000',
    pesticide: '15000'
  },
  {
    label: 'Bihar Arhar/Tur (Summer)',
    year: '2022',
    state: 'Bihar',
    crop: 'Arhar/Tur',
    season: 'Summer',
    area: '1600',
    production: '1920',
    annualRainfall: '1200',
    fertilizer: '120000',
    pesticide: '9500'
  },
  {
    label: 'Assam Jute (Kharif)',
    year: '2023',
    state: 'Assam',
    crop: 'Jute',
    season: 'Kharif',
    area: '1500',
    production: '4050',
    annualRainfall: '2100',
    fertilizer: '135000',
    pesticide: '11000'
  }
];

// Metrics sourced from model_results.json (trained on 17,400 samples, tested on 4,350 samples)
const ALGORITHM_CONFIGS = [
  {
    id: 'xgboost',
    title: 'XGBoost Regressor',
    shortName: 'XGBoost',
    badge: '⚡ Gradient Boosting',
    desc: 'Regularized gradient boosted trees (150 estimators, lr=0.08, max_depth=6). Best benchmark R² on holdout test set.',
    r2: '98.77%',
    rmse: '104.527',
    mae: '9.0894',
    brandColor: '#059669',
    brandBg: '#ecfdf5',
    brandBorder: '#10b981',
    lightBorder: '#a7f3d0'
  },
  {
    id: 'random_forest',
    title: 'Random Forest Regressor',
    shortName: 'Random Forest',
    badge: '🌲 Bagging Forest',
    desc: 'Parallel ensemble of 100 bootstrap decision trees (max_depth=16) providing variance reduction and stability.',
    r2: '98.38%',
    rmse: '120.0599',
    mae: '8.3927',
    brandColor: '#16a34a',
    brandBg: '#f0fdf4',
    brandBorder: '#22c55e',
    lightBorder: '#bbf7d0'
  },
  {
    id: 'svr',
    title: 'Support Vector Regression (SVR)',
    shortName: 'SVR',
    badge: '📈 Hyperplane Margin',
    desc: 'Radial Basis Function (RBF) kernel SVR (C=10, epsilon=0.1) with QuantileTransformer target scaling.',
    r2: '81.02%',
    rmse: '410.9448',
    mae: '28.0784',
    brandColor: '#4f46e5',
    brandBg: '#eef2ff',
    brandBorder: '#6366f1',
    lightBorder: '#c7d2fe'
  }
];

const Prediction = () => {
  const [sampleIdx, setSampleIdx] = useState(0);
  const [sampleToast, setSampleToast] = useState('');

  // Mode & Algorithm State (Requirements 1, 6, 8)
  const [predictionMode, setPredictionMode] = useState('single'); // 'single' | 'compare'
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('xgboost'); // 'xgboost' | 'random_forest' | 'svr'

  // Results State (Requirement 8 & 12)
  const [singlePrediction, setSinglePrediction] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null);

  const [formData, setFormData] = useState({
    year: '2023',
    state: 'Punjab',
    crop: 'Wheat',
    season: 'Rabi',
    area: '2500',
    production: '10500',
    annualRainfall: '650',
    fertilizer: '280000',
    pesticide: '20000'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Centralized Prediction Runner
  const executePrediction = async (modeOverride = null, algoOverride = null) => {
    const activeMode = modeOverride || predictionMode;
    const activeAlgo = algoOverride || selectedAlgorithm;

    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    try {
      if (activeMode === 'single') {
        // Clear any previous comparison results
        setComparisonResults(null);
        let response;

        // Run ONLY the selected algorithm function
        if (activeAlgo === 'xgboost') {
          response = await api.predictWithXGBoost(formData);
        } else if (activeAlgo === 'random_forest') {
          response = await api.predictWithRandomForest(formData);
        } else if (activeAlgo === 'svr') {
          response = await api.predictWithSVR(formData);
        }

        if (response && response.success) {
          setSinglePrediction(response.data);
        } else {
          throw new Error(response?.message || 'Failed to compute single model prediction.');
        }
      } else {
        // Compare All Mode: Clear single prediction
        setSinglePrediction(null);
        const response = await api.predictCompareAll(formData);
        if (response && response.success) {
          setComparisonResults(response.data);
        } else {
          throw new Error(response?.message || 'Failed to compare algorithms.');
        }
      }
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Error communicating with prediction server.');
    } finally {
      setLoading(false);
    }
  };

  // Switch Mode Handler (clears old results immediately, toggles mode without auto-running)
  const handleModeChange = (mode) => {
    setPredictionMode(mode);
    setSinglePrediction(null);
    setComparisonResults(null);
    setApiError(null);
  };

  // Switch Algorithm Handler (clears old results immediately - Requirement 12)
  const handleAlgorithmSelect = (algoId) => {
    setPredictionMode('single');
    setSelectedAlgorithm(algoId);
    setSinglePrediction(null);
    setComparisonResults(null);
    setApiError(null);
  };

  const validate = () => {
    const errs = {};
    if (!formData.year || isNaN(formData.year) || formData.year < 1990 || formData.year > 2050) {
      errs.year = 'Enter a valid harvest year (1990-2050).';
    }
    if (!formData.state) errs.state = 'Please select a state.';
    if (!formData.crop) errs.crop = 'Please select a crop.';
    if (!formData.season) errs.season = 'Please select a season.';

    if (!formData.area || isNaN(formData.area) || parseFloat(formData.area) <= 0) {
      errs.area = 'Area must be greater than 0 hectares.';
    }
    if (formData.production !== '' && formData.production !== null && formData.production !== undefined) {
      if (isNaN(formData.production) || parseFloat(formData.production) < 0) {
        errs.production = 'Production must be a non-negative number if entered.';
      }
    }
    if (formData.annualRainfall === '' || isNaN(formData.annualRainfall) || parseFloat(formData.annualRainfall) < 0) {
      errs.annualRainfall = 'Annual Rainfall cannot be negative.';
    }
    if (formData.fertilizer === '' || isNaN(formData.fertilizer) || parseFloat(formData.fertilizer) < 0) {
      errs.fertilizer = 'Fertilizer cannot be negative.';
    }
    if (formData.pesticide === '' || isNaN(formData.pesticide) || parseFloat(formData.pesticide) < 0) {
      errs.pesticide = 'Pesticide cannot be negative.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Prediction Submit Handler (Requirement 9)
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    await executePrediction();
  };

  // Rotates to a new realistic preset
  const handleQuickSample = () => {
    setSampleIdx(prevIdx => {
      let nextIdx = (prevIdx + 1) % SAMPLE_PRESETS.length;
      if (SAMPLE_PRESETS[nextIdx].crop === formData.crop && SAMPLE_PRESETS.length > 1) {
        nextIdx = (nextIdx + 1) % SAMPLE_PRESETS.length;
      }
      const chosen = SAMPLE_PRESETS[nextIdx];

      setFormData({
        year: chosen.year,
        state: chosen.state,
        crop: chosen.crop,
        season: chosen.season,
        area: chosen.area,
        production: chosen.production,
        annualRainfall: chosen.annualRainfall,
        fertilizer: chosen.fertilizer,
        pesticide: chosen.pesticide
      });

      setSinglePrediction(null);
      setComparisonResults(null);
      setSampleToast(`${chosen.label} (${nextIdx + 1}/${SAMPLE_PRESETS.length})`);
      setTimeout(() => setSampleToast(''), 2500);
      setErrors({});
      return nextIdx;
    });
  };

  // Selected algorithm object
  const currentAlgoConfig = ALGORITHM_CONFIGS.find(a => a.id === selectedAlgorithm) || ALGORITHM_CONFIGS[0];

  // Dynamic Button Label (Requirement 7)
  const getButtonLabel = () => {
    if (loading) {
      if (predictionMode === 'single') {
        return `Running inference with ${currentAlgoConfig.shortName}...`;
      }
      return 'Running inference & comparing all 3 algorithms...';
    }

    if (predictionMode === 'single') {
      if (selectedAlgorithm === 'xgboost') return 'Predict with XGBoost';
      if (selectedAlgorithm === 'random_forest') return 'Predict with Random Forest';
      if (selectedAlgorithm === 'svr') return 'Predict with SVR';
      return `Predict with ${currentAlgoConfig.shortName}`;
    }

    return 'Compare All 3 Algorithms & Find Best Model';
  };

  return (
    <div className="animate-fade-in" style={{ padding: '3.5rem 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div className="section-header">
          <span className="section-badge">
            <Sparkles size={14} />
            <span>Agricultural Intelligence Inference</span>
          </span>
          <h1 className="section-title">Crop Yield Prediction Form</h1>
          <p className="section-subtitle">
            Input agronomic and climatological parameters. Choose whether to predict using a <strong>Single Algorithm</strong> or <strong>Compare All Algorithms</strong> to dynamically determine the highest yield.
          </p>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: '1rem 1.25rem',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Prediction Error:</strong> {apiError}
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
          {/* Top Form Controls: Mode Selector & Sample Data Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '0.85rem',
            padding: '1rem 1.25rem'
          }}>
            {/* Mode Selector (Requirement 6) */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                Prediction Mode
              </div>
              <div style={{ display: 'inline-flex', backgroundColor: '#e2e8f0', borderRadius: '0.5rem', padding: '3px', gap: '3px' }}>
                <button
                  type="button"
                  id="mode-single-btn"
                  onClick={() => handleModeChange('single')}
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: predictionMode === 'single' ? '#ffffff' : 'transparent',
                    color: predictionMode === 'single' ? 'var(--primary)' : '#64748b',
                    boxShadow: predictionMode === 'single' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Cpu size={15} />
                  <span>Single Algorithm</span>
                </button>

                <button
                  type="button"
                  id="mode-compare-btn"
                  onClick={() => handleModeChange('compare')}
                  title="Switch to Best Algorithm / Comparison Mode"
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: predictionMode === 'compare' ? '#ffffff' : 'transparent',
                    color: predictionMode === 'compare' ? '#b45309' : '#64748b',
                    boxShadow: predictionMode === 'compare' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Trophy size={15} color={predictionMode === 'compare' ? '#d97706' : '#64748b'} />
                  <span>Compare All</span>
                </button>
              </div>
            </div>

            {/* Fill Sample Data Preset */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {sampleToast && (
                <span
                  className="badge badge-success animate-fade-in"
                  style={{
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <CheckCircle2 size={14} />
                  <span>{sampleToast}</span>
                </span>
              )}
              <button
                type="button"
                id="btn-fill-sample-data"
                onClick={handleQuickSample}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                title="Click to cycle through 10 realistic Indian crop scenarios"
              >
                <RefreshCw size={14} />
                <span>Fill Sample Data</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Grid 1: Categorical & Temporal */}
            <div className="grid-3" style={{ marginBottom: '1rem' }}>
              {/* Year */}
              <div className="form-group">
                <label className="form-label" htmlFor="year">
                  <Calendar size={16} color="var(--primary)" />
                  <span>Harvest Year *</span>
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  min="1990"
                  max="2050"
                  className="form-input"
                  value={formData.year}
                  onChange={handleChange}
                />
                {errors.year && <div className="form-error">{errors.year}</div>}
              </div>

              {/* State */}
              <div className="form-group">
                <label className="form-label" htmlFor="state">
                  <MapPin size={16} color="var(--primary)" />
                  <span>State / Region *</span>
                </label>
                <select
                  id="state"
                  name="state"
                  className="form-select"
                  value={formData.state}
                  onChange={handleChange}
                >
                  {STATES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                {errors.state && <div className="form-error">{errors.state}</div>}
              </div>

              {/* Crop */}
              <div className="form-group">
                <label className="form-label" htmlFor="crop">
                  <Wheat size={16} color="var(--primary)" />
                  <span>Crop Typology *</span>
                </label>
                <select
                  id="crop"
                  name="crop"
                  className="form-select"
                  value={formData.crop}
                  onChange={handleChange}
                >
                  {CROPS.map(cr => (
                    <option key={cr} value={cr}>{cr}</option>
                  ))}
                </select>
                {errors.crop && <div className="form-error">{errors.crop}</div>}
              </div>
            </div>

            {/* Grid 2: Season & Area & Production */}
            <div className="grid-3" style={{ marginBottom: '1rem' }}>
              {/* Season */}
              <div className="form-group">
                <label className="form-label" htmlFor="season">
                  <Calendar size={16} color="var(--primary)" />
                  <span>Cropping Season *</span>
                </label>
                <select
                  id="season"
                  name="season"
                  className="form-select"
                  value={formData.season}
                  onChange={handleChange}
                >
                  {SEASONS.map(sn => (
                    <option key={sn} value={sn}>{sn}</option>
                  ))}
                </select>
                {errors.season && <div className="form-error">{errors.season}</div>}
              </div>

              {/* Area */}
              <div className="form-group">
                <label className="form-label" htmlFor="area">
                  <Maximize2 size={16} color="var(--primary)" />
                  <span>Cultivated Area (Hectares) *</span>
                </label>
                <input
                  id="area"
                  name="area"
                  type="number"
                  step="any"
                  placeholder="e.g. 1500"
                  className="form-input"
                  value={formData.area}
                  onChange={handleChange}
                />
                {errors.area && <div className="form-error">{errors.area}</div>}
              </div>

              {/* Production Reference (Optional) */}
              <div className="form-group">
                <label className="form-label" htmlFor="production">
                  <Package size={16} color="var(--primary)" />
                  <span>Production Reference (MT - Optional)</span>
                </label>
                <input
                  id="production"
                  name="production"
                  type="number"
                  step="any"
                  placeholder="Optional baseline (e.g. 10500)"
                  className="form-input"
                  value={formData.production}
                  onChange={handleChange}
                />
                <span className="form-hint">AI calculates total production dynamically</span>
                {errors.production && <div className="form-error">{errors.production}</div>}
              </div>
            </div>

            {/* Grid 3: Climatological & Chemical Inputs */}
            <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
              {/* Annual Rainfall */}
              <div className="form-group">
                <label className="form-label" htmlFor="annualRainfall">
                  <CloudRain size={16} color="var(--primary)" />
                  <span>Annual Rainfall (mm) *</span>
                </label>
                <input
                  id="annualRainfall"
                  name="annualRainfall"
                  type="number"
                  step="any"
                  placeholder="e.g. 750"
                  className="form-input"
                  value={formData.annualRainfall}
                  onChange={handleChange}
                />
                <span className="form-hint">Average annual precipitation in mm</span>
                {errors.annualRainfall && <div className="form-error">{errors.annualRainfall}</div>}
              </div>

              {/* Fertilizer */}
              <div className="form-group">
                <label className="form-label" htmlFor="fertilizer">
                  <FlaskConical size={16} color="var(--primary)" />
                  <span>Fertilizer Applied (kg) *</span>
                </label>
                <input
                  id="fertilizer"
                  name="fertilizer"
                  type="number"
                  step="any"
                  placeholder="e.g. 250000"
                  className="form-input"
                  value={formData.fertilizer}
                  onChange={handleChange}
                />
                <span className="form-hint">Total NPK fertilizer consumed in kg</span>
                {errors.fertilizer && <div className="form-error">{errors.fertilizer}</div>}
              </div>

              {/* Pesticide */}
              <div className="form-group">
                <label className="form-label" htmlFor="pesticide">
                  <Bug size={16} color="var(--primary)" />
                  <span>Pesticide Applied (kg) *</span>
                </label>
                <input
                  id="pesticide"
                  name="pesticide"
                  type="number"
                  step="any"
                  placeholder="e.g. 18000"
                  className="form-input"
                  value={formData.pesticide}
                  onChange={handleChange}
                />
                <span className="form-hint">Total chemical plant protection in kg</span>
                {errors.pesticide && <div className="form-error">{errors.pesticide}</div>}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ALGORITHM SELECTION SECTION                                    */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              {predictionMode === 'single' ? (
                /* SINGLE ALGORITHM MODE UI (Requirement 1 & 6) */
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Cpu size={20} color="var(--primary)" />
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                        Select Algorithm
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#ecfdf5',
                      color: '#065f46',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      border: '1px solid #a7f3d0'
                    }}>
                      Single Model Execution Mode
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: '1rem' }}>
                    Select exactly one machine learning algorithm below. Prediction will run <strong>ONLY</strong> with the selected model.
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    {ALGORITHM_CONFIGS.map((algo) => {
                      const isSelected = (selectedAlgorithm === algo.id);
                      return (
                        <div
                          key={algo.id}
                          id={`algo-card-${algo.id}`}
                          onClick={() => handleAlgorithmSelect(algo.id)}
                          style={{
                            backgroundColor: isSelected ? algo.brandBg : '#ffffff',
                            border: isSelected ? `2.5px solid ${algo.brandBorder}` : '1.5px solid #cbd5e1',
                            borderRadius: '0.75rem',
                            padding: '1.1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected ? `0 6px 16px ${algo.brandColor}25` : 'none',
                            position: 'relative',
                            transform: isSelected ? 'translateY(-2px)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '0.15rem 0.55rem',
                              borderRadius: '9999px',
                              backgroundColor: isSelected ? algo.brandColor : '#f1f5f9',
                              color: isSelected ? '#ffffff' : '#64748b'
                            }}>
                              {algo.badge}
                            </span>
                            {isSelected && <CheckCircle2 size={18} color={algo.brandColor} />}
                          </div>

                          <div style={{ fontWeight: 800, fontSize: '0.98rem', color: isSelected ? algo.brandColor : 'var(--text-main)', marginBottom: '0.3rem' }}>
                            {algo.title}
                          </div>

                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '0.65rem' }}>
                            {algo.desc}
                          </div>

                          <div style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: isSelected ? algo.brandColor : '#64748b',
                            display: 'flex',
                            gap: '0.6rem',
                            borderTop: '1px solid #e2e8f0',
                            paddingTop: '0.45rem'
                          }}>
                            <span>R²: {algo.r2}</span>
                            <span>•</span>
                            <span>RMSE: {algo.rmse}</span>
                            <span>•</span>
                            <span>MAE: {algo.mae}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '0.625rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.82rem',
                    color: '#1e40af',
                    lineHeight: '1.5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}>
                    <Sparkles size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                    <span>
                      <strong>Single Algorithm Mode Active:</strong> Clicking prediction will run <strong>ONLY {currentAlgoConfig.title}</strong>. It will not calculate or compare other algorithms.
                    </span>
                  </div>
                </>
              ) : (
                /* COMPARE ALL ALGORITHMS MODE UI (Requirement 5 & 6) */
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Trophy size={20} color="#d97706" />
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                        Best Algorithm / Comparison Mode
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      border: '1px solid #fde68a'
                    }}>
                      All 3 Models Evaluated Simultaneously
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: '1rem' }}>
                    Runs all 3 validated algorithms simultaneously on your input data. Yields are dynamically evaluated and the algorithm with the <strong>Highest Predicted Yield</strong> is crowned 🏆 Best Algorithm.
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.85rem',
                    marginBottom: '1rem'
                  }}>
                    {ALGORITHM_CONFIGS.map((algo) => (
                      <div
                        key={algo.id}
                        id={`compare-algo-${algo.id}`}
                        onClick={() => handleAlgorithmSelect(algo.id)}
                        title="Click to test this model individually"
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1.5px solid #cbd5e1',
                          borderRadius: '0.75rem',
                          padding: '0.9rem',
                          boxShadow: 'var(--shadow-xs)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = algo.brandBorder;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            backgroundColor: '#f1f5f9',
                            color: '#475569'
                          }}>
                            {algo.badge}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 600 }}>Single Test →</span>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                          {algo.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          R²: {algo.r2} • RMSE: {algo.rmse}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '0.625rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.82rem',
                    color: '#92400e',
                    lineHeight: '1.5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}>
                    <Trophy size={16} color="#d97706" style={{ flexShrink: 0 }} />
                    <span>
                      <strong>Comparison Rule:</strong> Highest Predicted Yield = 🏆 Best Algorithm. All three models will be computed and ranked side-by-side with full metric breakdowns.
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Dynamic Submit Button (Requirement 7) */}
            <button
              type="submit"
              id="btn-predict-submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                padding: '1.1rem',
                fontSize: '1.15rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.8 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                background: predictionMode === 'single'
                  ? currentAlgoConfig.brandColor
                  : 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                borderColor: predictionMode === 'single'
                  ? currentAlgoConfig.brandColor
                  : '#b45309',
                boxShadow: predictionMode === 'compare'
                  ? '0 6px 20px rgba(217, 119, 6, 0.35)'
                  : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? (
                <>
                  <div style={{ animation: 'spin 1s linear infinite', display: 'flex' }}>
                    <RefreshCw size={20} />
                  </div>
                  <span>{getButtonLabel()}</span>
                </>
              ) : (
                <>
                  {predictionMode === 'single' ? <Sparkles size={20} /> : <Trophy size={20} />}
                  <span>{getButtonLabel()}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Result Modal (Single Algorithm or Comparison Mode) */}
        {((predictionMode === 'single' && singlePrediction) || (predictionMode === 'compare' && comparisonResults)) && (
          <PredictionResultModal
            mode={predictionMode}
            result={predictionMode === 'single' ? singlePrediction : comparisonResults}
            onClose={() => {
              setSinglePrediction(null);
              setComparisonResults(null);
            }}
            onReset={() => {
              setSinglePrediction(null);
              setComparisonResults(null);
              handleQuickSample();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Prediction;
