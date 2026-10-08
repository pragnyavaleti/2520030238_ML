# 🌾 Crop Yield Prediction Using Machine Learning

> A modern, full-stack, enterprise-grade agricultural intelligence web application for forecasting crop yields using **Random Forest**, **XGBoost**, and **Support Vector Regression (SVR)** with **Firebase Firestore** database persistence.

---

## 🏛️ Multi-Layer Architecture

```
                        ┌─────────────────────────────────────────┐
                        │      React.js Modern Frontend (Vite)    │
                        │  - Chart.js Visualizations & Analytics │
                        │  - Crop Prediction Form & Modal Result  │
                        │  - History Management & Data Export     │
                        └────────────────────┬────────────────────┘
                                             │ HTTP (Port 3000 -> 5000)
                                             ▼
                        ┌─────────────────────────────────────────┐
                        │       Node.js + Express.js Backend      │
                        │    - REST APIs, Input Validation        │
                        │    - ML Gateway Proxy & Orchestrator   │
                        └────────────┬───────────────────────┬────┘
                                     │                       │
                Firestore Read/Write │                       │ REST /predict, /models
                                     ▼                       ▼
            ┌─────────────────────────────┐     ┌────────────────────────────────┐
            │      Firebase Firestore     │     │     Python FastAPI ML Service  │
            │  (Predictions & History)    │     │  - Data Cleaning & Preprocess  │
            │  + Zero-Config Local Store  │     │  - Scikit-learn, XGBoost, SVR  │
            └─────────────────────────────┘     └──────────────┬─────────────────┘
                                                               │
                                         ┌─────────────────────┼─────────────────────┐
                                         ▼                     ▼                     ▼
                               ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
                               │  Random Forest   │  │     XGBoost      │  │       SVR        │
                               │    Regressor     │  │    Regressor     │  │    Regressor     │
                               └──────────────────┘  └──────────────────┘  └──────────────────┘
                                                       (🏆 Top Model)
```

---

## 🚀 Key Features Across All 8 Pages

1. **Home Page (`/`)**:
   - Hero banner with agronomic intelligence metrics ribbon.
   - Comprehensive explanation of crop yield prediction and importance of ML in modern farming.
   - Overview cards for Random Forest, XGBoost, and SVR.
   - Dynamic Call-To-Action buttons leading to the prediction dashboard.

2. **About Page (`/about`)**:
   - Agriculture problem statement: Climate volatility, monsoon shifts, input imbalances.
   - Project objectives: Precision agriculture, resource optimization, food security planning.
   - Determinant agronomic factors (Rainfall, Fertilizer NPK, Pesticide, Cultivated Area).
   - 4-step Machine Learning pipeline methodology & tech stack breakdown.

3. **Dataset and EDA Page (`/dataset`)**:
   - Real-time dataset metrics: 1,250 records, 9 features, 0 missing values, 0 duplicates.
   - 6 interactive distribution histograms:
     - Yield Distribution (tons/ha)
     - Production Distribution (metric tons)
     - Annual Rainfall (mm)
     - Cultivated Area (hectares)
     - Fertilizer Input (kg)
     - Pesticide Application (kg)
   - Interactive Pearson Correlation Heatmap matrix.
   - Raw dataset sample preview table.

4. **Machine Learning Models Page (`/models`)**:
   - Technical deep-dives into:
     - **Random Forest Regressor**: Bagging ensemble, orthogonal hyperplanes, outlier resilience.
     - **XGBoost Regressor**: Extreme Gradient Boosting, second-order Taylor gradients, regularized loss.
     - **Support Vector Regression (SVR)**: RBF kernel mapping, epsilon-insensitive margin tube.
   - Mathematical mechanics and key advantages.

5. **Model Comparison Page (`/compare`)**:
   - 🏆 **Top Performing Model Banner**: Highlights XGBoost (Highest R²: **98.5%**, Lowest RMSE: **2.66**, Lowest MAE: **0.75**).
   - Detailed benchmark table comparing MAE, MSE, RMSE, and R² Score on 20% holdout test data.
   - 4 interactive comparative charts for MAE, MSE, RMSE, and R² Score.

6. **Crop Yield Prediction Page (`/predict`)**:
   - User input form: Harvest Year, State, Crop, Season, Area (ha), Production (tons), Rainfall (mm), Fertilizer (kg), Pesticide (kg).
   - Model Selector: **Top Algorithm (XGBoost Regressor - 99.2% R²)**, XGBoost Regressor, Random Forest Regressor, and SVR.
   - Client-side validation for non-negative inputs and positive areas.
   - "Fill Sample Data" button for instantaneous testing across diverse agronomic scenarios.

7. **Prediction Result Component & Modal**:
   - Prominent agricultural yield badge (e.g. `9.51 tons/ha`).
   - Model used badge (e.g. `XGBoost`).
   - Yield status assessment (Low, Moderate, High productivity) with agronomic advisory.
   - Complete input parameters breakdown card.
   - Quick navigation to view record in History or reset form.

8. **Prediction History Page (`/history`)**:
   - Reads records directly from **Firebase Firestore** `predictions` collection.
   - Real-time live search by State, Crop, or Model.
   - Multi-dropdown filtering by State, Crop, and Model.
   - Single-click record deletion with confirmation.
   - **Export to CSV** feature for agricultural reporting.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, React Router DOM 6, Axios, Chart.js, react-chartjs-2, Lucide React, Modern CSS Design System |
| **Backend** | Node.js, Express.js, Firebase Admin SDK, Axios, CORS, Dotenv |
| **Database** | Firebase Firestore (`predictions` collection) + Zero-Config Local Store Fallback |
| **ML Microservice** | Python 3.12, FastAPI, Uvicorn, Pandas, NumPy, Scikit-learn, XGBoost, Joblib |

---

## 💻 Quick Start & Installation

### Prerequisites
- **Node.js**: v18+ (tested on v24)
- **Python**: 3.10+ (tested on Python 3.12)

---

### Step 1: Python Machine Learning Microservice

```bash
cd ml-service

# Install Python requirements
pip install -r requirements.txt

# Train models & evaluate (generates .pkl models & model_results.json)
python train_models.py

# Start FastAPI inference service (Port 8000)
python -m uvicorn app:app --host 127.0.0.1 --port 8000
```
> FastAPI Swagger Documentation will be available at: `http://127.0.0.1:8000/docs`

---

### Step 2: Node.js + Express Backend API Gateway

```bash
cd backend

# Install dependencies
npm install

# (Optional) Configure .env with your Firebase Firestore credentials
# If skipped, the server automatically defaults to the zero-config persistent local store!
cp .env.example .env

# Start Backend server (Port 5000)
npm start
```
> Backend API Health Endpoint: `http://localhost:5000/api/health`

---

### Step 3: React.js Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server (Port 3000)
npm run dev
```
> Open your browser and navigate to: `http://localhost:3000/`

---

## 🔥 Firebase Firestore Configuration

The application natively supports **Firebase Firestore**.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Under **Build**, select **Firestore Database** and create a database.
3. Go to **Project Settings** > **Service Accounts** > Click **Generate new private key**.
4. Rename the downloaded JSON file to `serviceAccountKey.json` and place it in:
   ```
   backend/config/serviceAccountKey.json
   ```
   *OR* configure your environment variables in `backend/.env`:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
5. Restart the backend server. The server will detect the credentials and log:
   ```
   Firebase Firestore initialized successfully with serviceAccountKey.json
   ```

> **Note**: If Firebase credentials are not provided, the application activates an automatic zero-config persistent store in `backend/data/predictions.json`, enabling 100% full functionality out of the box without requiring manual cloud keys!

---

## 📡 REST API Documentation

### 1. Prediction API
- **Endpoint**: `POST /api/predict`
- **Request Body**:
  ```json
  {
    "year": 2023,
    "state": "Punjab",
    "crop": "Wheat",
    "season": "Rabi",
    "area": 2500,
    "production": 10500,
    "annualRainfall": 650,
    "fertilizer": 280000,
    "pesticide": 20000,
    "model": "Best Model"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "pred_1789105047660_dzkg4",
      "year": 2023,
      "state": "Punjab",
      "crop": "Wheat",
      "season": "Rabi",
      "area": 2500,
      "production": 10500,
      "annualRainfall": 650,
      "fertilizer": 280000,
      "pesticide": 20000,
      "predictedYield": 9.51,
      "modelUsed": "XGBoost",
      "yieldCategory": "High",
      "advisory": "Favorable soil and environmental conditions indicate strong agricultural productivity.",
      "createdAt": "2026-09-11T05:37:27.660Z"
    }
  }
  ```

### 2. Prediction History API
- **Endpoint**: `GET /api/predictions?search=Punjab&crop=Wheat&model=XGBoost`
- **Response**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [ ... ]
  }
  ```

### 3. Delete Prediction API
- **Endpoint**: `DELETE /api/predictions/:id`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Prediction with ID pred_... was deleted successfully."
  }
  ```

### 4. Model Evaluation & Best Model APIs
- `GET /api/models/results`: Returns all model benchmarks (MAE, MSE, RMSE, R² Score) and feature importances.
- `GET /api/models/best`: Returns the top-performing model.
- `GET /api/eda`: Returns dataset statistics, frequency distributions, and correlation matrix.

---

## 📊 Evaluation Results Summary

| Model | MAE | MSE | RMSE | R² Score | Status |
|---|---|---|---|---|---|
| **XGBoost Regressor** | **0.7582** | **7.0762** | **2.6601** | **0.9848** | 🏆 **Best Model** |
| **Random Forest Regressor** | 1.0459 | 12.5538 | 3.5431 | 0.9731 | Evaluated |
| **Support Vector Regression (SVR)** | 1.8239 | 54.5101 | 7.3831 | 0.8830 | Evaluated |
