import os
import json
import pandas as pd
import numpy as np
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from predict import predict_crop_yield, predict_single_model, predict_compare_all, get_results

app = FastAPI(
    title="Crop Yield Prediction ML Service",
    description="Machine Learning REST API for predicting crop yield using Random Forest, XGBoost, and SVR.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

base_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(base_dir, '..', 'dataset', 'crop_yield.csv')

class PredictionInput(BaseModel):
    year: int = Field(..., ge=1990, le=2050, description="Harvest Year")
    state: str = Field(..., min_length=2, description="State Name")
    crop: str = Field(..., min_length=2, description="Crop Name")
    season: str = Field(..., min_length=2, description="Cropping Season")
    area: float = Field(..., gt=0, description="Area in Hectares")
    production: Optional[float] = Field(None, ge=0, description="Optional Production in Metric Tons")
    annualRainfall: float = Field(..., ge=0, description="Annual Rainfall in mm")
    fertilizer: float = Field(..., ge=0, description="Fertilizer consumed in kg")
    pesticide: float = Field(..., ge=0, description="Pesticides applied in kg")
    model: Optional[str] = Field("xgboost", description="Model Selection: xgboost, random_forest, svr, or compare")
    mode: Optional[str] = Field("single", description="Prediction Mode: 'single' or 'compare'")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Crop Yield ML Service", "version": "1.0.0"}

@app.post("/predict")
def predict(payload: PredictionInput):
    try:
        input_data = payload.model_dump()
        selected_model = payload.model or "xgboost"
        mode = payload.mode or "single"
        result = predict_crop_yield(input_data, selected_model=selected_model, mode=mode)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/single")
def predict_single(payload: PredictionInput):
    try:
        input_data = payload.model_dump()
        selected_model = payload.model or "xgboost"
        result = predict_single_model(input_data, selected_model=selected_model)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/compare")
def predict_compare(payload: PredictionInput):
    try:
        input_data = payload.model_dump()
        result = predict_compare_all(input_data)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models/results")
def get_models_results():
    results = get_results()
    if not results:
        raise HTTPException(status_code=404, detail="Model evaluation results not found. Please train models first.")
    return {"success": True, "data": results}

@app.get("/models/best")
def get_best_model():
    results = get_results()
    best_info = results.get("best_model", {})
    if not best_info:
        raise HTTPException(status_code=404, detail="Best model information not found.")
    return {"success": True, "data": best_info}

@app.get("/dataset/eda")
def get_dataset_eda():
    if not os.path.exists(dataset_path):
        raise HTTPException(status_code=404, detail="Dataset file not found.")

    df = pd.read_csv(dataset_path)

    # Basic stats
    total_records = len(df)
    missing_values = int(df.isnull().sum().sum())
    duplicate_values = int(df.duplicated().sum())
    columns = list(df.columns)

    # Compute distribution histograms for visualizations
    def get_histogram_buckets(series, bins=10):
        s_clean = series.dropna()
        counts, bin_edges = np.histogram(s_clean, bins=bins)
        return [
            {
                "range": f"{round(bin_edges[i], 1)}-{round(bin_edges[i+1], 1)}",
                "min": round(float(bin_edges[i]), 2),
                "max": round(float(bin_edges[i+1]), 2),
                "count": int(counts[i])
            }
            for i in range(len(counts))
        ]

    yield_dist = get_histogram_buckets(df['Yield'], bins=12)
    production_dist = get_histogram_buckets(df['Production'], bins=10)
    rainfall_dist = get_histogram_buckets(df['Annual_Rainfall'], bins=10)
    area_dist = get_histogram_buckets(df['Area'], bins=10)
    fertilizer_dist = get_histogram_buckets(df['Fertilizer'], bins=10)
    pesticide_dist = get_histogram_buckets(df['Pesticide'], bins=10)

    # Crop-wise average yield
    crop_avg_yield = df.groupby('Crop')['Yield'].mean().round(2).to_dict()
    # State-wise average yield
    state_avg_yield = df.groupby('State')['Yield'].mean().round(2).to_dict()

    # Numerical correlation matrix
    num_cols = ['Year', 'Area', 'Production', 'Annual_Rainfall', 'Fertilizer', 'Pesticide', 'Yield']
    corr_matrix = df[num_cols].corr().round(3).to_dict()

    return {
        "success": True,
        "data": {
            "summary": {
                "total_records": total_records,
                "features_count": len(columns) - 1, # excluding target
                "columns": columns,
                "missing_values": missing_values,
                "duplicate_values": duplicate_values
            },
            "distributions": {
                "yield": yield_dist,
                "production": production_dist,
                "rainfall": rainfall_dist,
                "area": area_dist,
                "fertilizer": fertilizer_dist,
                "pesticide": pesticide_dist
            },
            "aggregates": {
                "crop_average_yield": crop_avg_yield,
                "state_average_yield": state_avg_yield
            },
            "correlation_matrix": corr_matrix,
            "sample_rows": df.head(10).to_dict(orient='records')
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
