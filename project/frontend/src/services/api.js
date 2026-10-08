import axios from 'axios';

// Vite proxies /api to http://localhost:5000 in dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export const api = {
  // Crop Yield Prediction - general
  predictYield: async (data) => {
    const response = await apiClient.post('/predict', data);
    return response.data;
  },

  // Dedicated single-algorithm prediction functions (Requirement 9)
  predictWithXGBoost: async (data) => {
    const response = await apiClient.post('/predict', {
      ...data,
      model: 'xgboost',
      mode: 'single'
    });
    return response.data;
  },

  predictWithRandomForest: async (data) => {
    const response = await apiClient.post('/predict', {
      ...data,
      model: 'random_forest',
      mode: 'single'
    });
    return response.data;
  },

  predictWithSVR: async (data) => {
    const response = await apiClient.post('/predict', {
      ...data,
      model: 'svr',
      mode: 'single'
    });
    return response.data;
  },

  // Dedicated compare-all prediction function
  predictCompareAll: async (data) => {
    const response = await apiClient.post('/predict', {
      ...data,
      model: 'compare',
      mode: 'compare'
    });
    return response.data;
  },

  // Prediction History from Firebase Firestore
  getHistory: async (params = {}) => {
    const response = await apiClient.get('/predictions', { params });
    return response.data;
  },

  // Delete Record from Firebase Firestore
  deletePrediction: async (id) => {
    const response = await apiClient.delete(`/predictions/${id}`);
    return response.data;
  },

  // Model Evaluation Results
  getModelResults: async () => {
    const response = await apiClient.get('/models/results');
    return response.data;
  },

  // Best Performing Model
  getBestModel: async () => {
    const response = await apiClient.get('/models/best');
    return response.data;
  },

  // Dataset EDA & Distribution Statistics
  getEdaStats: async () => {
    const response = await apiClient.get('/eda');
    return response.data;
  },

  // Health check
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  }
};

export default api;
