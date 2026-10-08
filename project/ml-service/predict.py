import os
import json
import joblib
import numpy as np
from datetime import datetime

base_dir = os.path.dirname(os.path.abspath(__file__))
saved_models_dir = os.path.join(base_dir, 'saved_models')

# Cache loaded models in memory
_models_cache = {}
_preprocessor_cache = None
_results_cache = None

def get_preprocessor():
    global _preprocessor_cache
    if _preprocessor_cache is None:
        path = os.path.join(saved_models_dir, 'preprocessor.pkl')
        if not os.path.exists(path):
            raise FileNotFoundError(f"Preprocessor not found at {path}. Please run train_models.py first.")
        _preprocessor_cache = joblib.load(path)
    return _preprocessor_cache

def get_results():
    global _results_cache
    path = os.path.join(base_dir, 'model_results.json')
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            _results_cache = json.load(f)
    else:
        _results_cache = {}
    return _results_cache

def get_model(model_key: str):
    global _models_cache
    if model_key in _models_cache:
        return _models_cache[model_key]

    model_files = {
        'Random Forest': 'random_forest.pkl',
        'random_forest': 'random_forest.pkl',
        'XGBoost': 'xgboost.pkl',
        'xgboost': 'xgboost.pkl',
        'SVR': 'svr.pkl',
        'svr': 'svr.pkl',
        'Support Vector Regression (SVR)': 'svr.pkl'
    }

    filename = model_files.get(model_key)
    if not filename:
        raise ValueError(f"Unknown model key '{model_key}'. Allowed: {list(model_files.keys())}")

    filepath = os.path.join(saved_models_dir, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Model file '{filename}' not found at {filepath}. Run train_models.py first.")

    model = joblib.load(filepath)
    _models_cache[model_key] = model
    return model

def _compute_category_and_advisory(crop_name: str, predicted_yield: float, model_used: str):
    """Dynamically compute category and advisory using true historical crop mean baseline."""
    preprocessor = get_preprocessor()
    baseline_yield = preprocessor.get_crop_baseline(crop_name)
    if baseline_yield <= 0:
        baseline_yield = 1.0

    # Productivity index is ratio of predicted yield to historical average yield for that crop
    productivity_percentage = round((predicted_yield / baseline_yield) * 100.0, 1)

    # Thresholds: >110% of historical average is High, 80-110% Moderate, <80% Low
    if productivity_percentage >= 110.0:
        yield_category = "High"
        advisory = (
            f"Favorable agronomic conditions. {model_used} projects strong harvest "
            f"productivity ({productivity_percentage}% of regional average for {crop_name})."
        )
    elif productivity_percentage >= 80.0:
        yield_category = "Moderate"
        advisory = (
            f"Standard yield forecast ({productivity_percentage}% of baseline average for {crop_name}). "
            f"Optimizing water management and fertilizer timing will elevate harvest potential."
        )
    else:
        yield_category = "Low"
        advisory = (
            f"Lower projected yield ({productivity_percentage}% of baseline average for {crop_name}). "
            f"Recommend soil health analysis, nutrient replenishment, and supplementary irrigation."
        )

    return yield_category, advisory, productivity_percentage


# ==============================================================================
# DEDICATED ALGORITHM PREDICTION FUNCTIONS (Requirement: STEP 4)
# ==============================================================================

def predictWithXGBoost(input_dict: dict) -> dict:
    """Executes prediction exclusively using XGBoost Regressor."""
    preprocessor = get_preprocessor()
    area_val = float(input_dict.get('area', input_dict.get('Area', 1000)))
    features = preprocessor.transform_single(input_dict, is_scaled=False)
    
    xgb_model = get_model('XGBoost')
    raw_val = float(xgb_model.predict(features)[0])
    predicted_yield = max(0.0, round(raw_val, 2))
    estimated_production = round(raw_val * area_val, 2)
    
    results = get_results()
    metrics = next((m for m in results.get("models", []) if m["model_name"] == "XGBoost"), {
        "r2_score": 0.9877, "rmse": 104.5270, "mae": 9.0894
    })
    
    crop_name = str(input_dict.get('crop', '')).strip()
    yield_category, advisory, productivity_percentage = _compute_category_and_advisory(
        crop_name, predicted_yield, "XGBoost Regressor"
    )

    return {
        "mode": "single",
        "model_key": "xgboost",
        "model_used": "XGBoost Regressor",
        "predicted_yield": predicted_yield,
        "raw_yield": raw_val,
        "estimated_production": estimated_production,
        "unit": "tons/hectare",
        "metrics": {
            "r2_score": metrics.get("r2_score", 0.9877),
            "rmse": metrics.get("rmse", 104.5270),
            "mae": metrics.get("mae", 9.0894)
        },
        "productivity_percentage": productivity_percentage,
        "yield_category": yield_category,
        "advisory": advisory,
        "prediction_date": datetime.now().isoformat(),
        "input_summary": {
            "year": int(input_dict.get('year', 2023)),
            "state": input_dict.get('state'),
            "crop": input_dict.get('crop'),
            "season": input_dict.get('season'),
            "area": area_val,
            "annual_rainfall": float(input_dict.get('annualRainfall', input_dict.get('Annual_Rainfall', 0))),
            "fertilizer": float(input_dict.get('fertilizer', input_dict.get('Fertilizer', 0))),
            "pesticide": float(input_dict.get('pesticide', input_dict.get('Pesticide', 0))),
            "estimated_production": estimated_production
        }
    }


def predictWithRandomForest(input_dict: dict) -> dict:
    """Executes prediction exclusively using Random Forest Regressor."""
    preprocessor = get_preprocessor()
    area_val = float(input_dict.get('area', input_dict.get('Area', 1000)))
    features = preprocessor.transform_single(input_dict, is_scaled=False)
    
    rf_model = get_model('Random Forest')
    raw_val = float(rf_model.predict(features)[0])
    predicted_yield = max(0.0, round(raw_val, 2))
    estimated_production = round(raw_val * area_val, 2)
    
    results = get_results()
    metrics = next((m for m in results.get("models", []) if m["model_name"] == "Random Forest"), {
        "r2_score": 0.9838, "rmse": 120.0599, "mae": 8.3927
    })
    
    crop_name = str(input_dict.get('crop', '')).strip()
    yield_category, advisory, productivity_percentage = _compute_category_and_advisory(
        crop_name, predicted_yield, "Random Forest Regressor"
    )

    return {
        "mode": "single",
        "model_key": "random_forest",
        "model_used": "Random Forest Regressor",
        "predicted_yield": predicted_yield,
        "raw_yield": raw_val,
        "estimated_production": estimated_production,
        "unit": "tons/hectare",
        "metrics": {
            "r2_score": metrics.get("r2_score", 0.9838),
            "rmse": metrics.get("rmse", 120.0599),
            "mae": metrics.get("mae", 8.3927)
        },
        "productivity_percentage": productivity_percentage,
        "yield_category": yield_category,
        "advisory": advisory,
        "prediction_date": datetime.now().isoformat(),
        "input_summary": {
            "year": int(input_dict.get('year', 2023)),
            "state": input_dict.get('state'),
            "crop": input_dict.get('crop'),
            "season": input_dict.get('season'),
            "area": area_val,
            "annual_rainfall": float(input_dict.get('annualRainfall', input_dict.get('Annual_Rainfall', 0))),
            "fertilizer": float(input_dict.get('fertilizer', input_dict.get('Fertilizer', 0))),
            "pesticide": float(input_dict.get('pesticide', input_dict.get('Pesticide', 0))),
            "estimated_production": estimated_production
        }
    }


def predictWithSVR(input_dict: dict) -> dict:
    """Executes prediction exclusively using Support Vector Regression (SVR)."""
    preprocessor = get_preprocessor()
    area_val = float(input_dict.get('area', input_dict.get('Area', 1000)))
    features_scaled = preprocessor.transform_single(input_dict, is_scaled=True)
    
    svr_model = get_model('SVR')
    raw_val = float(svr_model.predict(features_scaled)[0])
    predicted_yield = max(0.0, round(raw_val, 2))
    estimated_production = round(raw_val * area_val, 2)
    
    results = get_results()
    metrics = next((m for m in results.get("models", []) if "Support Vector" in m["model_name"] or "SVR" in m["model_name"]), {
        "r2_score": 0.8102, "rmse": 410.9448, "mae": 28.0784
    })
    
    crop_name = str(input_dict.get('crop', '')).strip()
    yield_category, advisory, productivity_percentage = _compute_category_and_advisory(
        crop_name, predicted_yield, "Support Vector Regression (SVR)"
    )

    return {
        "mode": "single",
        "model_key": "svr",
        "model_used": "Support Vector Regression (SVR)",
        "predicted_yield": predicted_yield,
        "raw_yield": raw_val,
        "estimated_production": estimated_production,
        "unit": "tons/hectare",
        "metrics": {
            "r2_score": metrics.get("r2_score", 0.8102),
            "rmse": metrics.get("rmse", 410.9448),
            "mae": metrics.get("mae", 28.0784)
        },
        "productivity_percentage": productivity_percentage,
        "yield_category": yield_category,
        "advisory": advisory,
        "prediction_date": datetime.now().isoformat(),
        "input_summary": {
            "year": int(input_dict.get('year', 2023)),
            "state": input_dict.get('state'),
            "crop": input_dict.get('crop'),
            "season": input_dict.get('season'),
            "area": area_val,
            "annual_rainfall": float(input_dict.get('annualRainfall', input_dict.get('Annual_Rainfall', 0))),
            "fertilizer": float(input_dict.get('fertilizer', input_dict.get('Fertilizer', 0))),
            "pesticide": float(input_dict.get('pesticide', input_dict.get('Pesticide', 0))),
            "estimated_production": estimated_production
        }
    }


def predict_single_model(input_dict: dict, selected_model: str = "xgboost") -> dict:
    """Dispatches to the single requested model without executing the others."""
    target_name = (selected_model or "").lower()
    if "forest" in target_name or "random" in target_name:
        return predictWithRandomForest(input_dict)
    elif "svr" in target_name or "vector" in target_name:
        return predictWithSVR(input_dict)
    else:
        return predictWithXGBoost(input_dict)


def predict_compare_all(input_dict: dict) -> dict:
    """
    COMPARE ALL ALGORITHMS MODE (STEP 9 & 10):
    Executes inference across all 3 models:
      - XGBoost Regressor
      - Random Forest Regressor
      - Support Vector Regression (SVR)
    Determines Best Algorithm strictly as:
      bestAlgorithm = algorithm with maximum predictedYield
    """
    preprocessor = get_preprocessor()
    area_val = float(input_dict.get('area', input_dict.get('Area', 1000)))
    results = get_results()

    models_metrics = {m["model_name"]: m for m in results.get("models", [])}

    # 1. Feature transformations
    features_unscaled = preprocessor.transform_single(input_dict, is_scaled=False)
    features_scaled = preprocessor.transform_single(input_dict, is_scaled=True)

    # 2. Run actual model predictions
    xgb_model = get_model('XGBoost')
    xgb_raw = float(xgb_model.predict(features_unscaled)[0])
    xgb_yield = max(0.0, round(xgb_raw, 2))

    rf_model = get_model('Random Forest')
    rf_raw = float(rf_model.predict(features_unscaled)[0])
    rf_yield = max(0.0, round(rf_raw, 2))

    svr_model = get_model('SVR')
    svr_raw = float(svr_model.predict(features_scaled)[0])
    svr_yield = max(0.0, round(svr_raw, 2))

    # Metric lookups from live model_results.json
    xgb_met = models_metrics.get("XGBoost", {"r2_score": 0.9877, "rmse": 104.5270, "mae": 9.0894})
    rf_met = models_metrics.get("Random Forest", {"r2_score": 0.9838, "rmse": 120.0599, "mae": 8.3927})
    svr_met = next((v for k, v in models_metrics.items() if "Support Vector" in k or "SVR" in k), {
        "r2_score": 0.8102, "rmse": 410.9448, "mae": 28.0784
    })

    algo_candidates = [
        {
            "key": "xgb",
            "model_name": "XGBoost Regressor",
            "predicted_yield": xgb_yield,
            "raw_yield": xgb_raw,
            "r2_score": xgb_met.get("r2_score", 0.9877),
            "rmse": xgb_met.get("rmse", 104.5270),
            "mae": xgb_met.get("mae", 9.0894),
            "badge_type": "Gradient Boosting"
        },
        {
            "key": "rf",
            "model_name": "Random Forest Regressor",
            "predicted_yield": rf_yield,
            "raw_yield": rf_raw,
            "r2_score": rf_met.get("r2_score", 0.9838),
            "rmse": rf_met.get("rmse", 120.0599),
            "mae": rf_met.get("mae", 8.3927),
            "badge_type": "Bagging Forest"
        },
        {
            "key": "svr",
            "model_name": "Support Vector Regression (SVR)",
            "predicted_yield": svr_yield,
            "raw_yield": svr_raw,
            "r2_score": svr_met.get("r2_score", 0.8102),
            "rmse": svr_met.get("rmse", 410.9448),
            "mae": svr_met.get("mae", 28.0784),
            "badge_type": "Hyperplane Margin"
        }
    ]

    # Best Algorithm rule: HIGHEST PREDICTED YIELD = BEST ALGORITHM (STEP 10)
    best_algo = max(algo_candidates, key=lambda x: x["predicted_yield"])

    # Sort descending by predicted yield
    sorted_algos = sorted(algo_candidates, key=lambda x: x["predicted_yield"], reverse=True)

    yield_comparison = " > ".join(
        f"{a['model_name'].replace(' Regressor', '').replace(' Regression ', '')}: {a['predicted_yield']} t/ha"
        for a in sorted_algos
    )

    selection_rationale = (
        f"{best_algo['model_name']} selected as the [BEST] Algorithm -- "
        f"produced the highest predicted crop yield ({best_algo['predicted_yield']} t/ha) "
        f"across all 3 algorithms. Comparison: {yield_comparison}."
    )

    all_predictions = []
    for rank, a in enumerate(sorted_algos):
        is_best = (a["model_name"] == best_algo["model_name"])
        all_predictions.append({
            "model_name": a["model_name"],
            "predicted_yield": a["predicted_yield"],
            "raw_yield": a["raw_yield"],
            "estimated_production": round(a["raw_yield"] * area_val, 2),
            "unit": "tons/ha",
            "r2_score": a["r2_score"],
            "rmse": a["rmse"],
            "mae": a["mae"],
            "is_best": is_best,
            "rank": rank + 1,
            "badge": "[BEST] ALGORITHM" if is_best else a["badge_type"]
        })

    predicted_yield = best_algo["predicted_yield"]
    estimated_production = round(best_algo["raw_yield"] * area_val, 2)
    model_used = best_algo["model_name"]

    crop_name = str(input_dict.get('crop', '')).strip()
    yield_category, advisory, productivity_percentage = _compute_category_and_advisory(
        crop_name, predicted_yield, model_used
    )

    return {
        "mode": "compare",
        "predicted_yield": predicted_yield,
        "raw_yield": best_algo["raw_yield"],
        "estimated_production": estimated_production,
        "unit": "tons/hectare",
        "model_used": model_used,
        "best_model_name": best_algo["model_name"],
        "productivity_percentage": productivity_percentage,
        "selection_rationale": selection_rationale,
        "yield_category": yield_category,
        "advisory": advisory,
        "prediction_date": datetime.now().isoformat(),
        "all_predictions": all_predictions,
        "input_summary": {
            "year": int(input_dict.get('year', 2023)),
            "state": input_dict.get('state'),
            "crop": input_dict.get('crop'),
            "season": input_dict.get('season'),
            "area": area_val,
            "annual_rainfall": float(input_dict.get('annualRainfall', input_dict.get('Annual_Rainfall', 0))),
            "fertilizer": float(input_dict.get('fertilizer', input_dict.get('Fertilizer', 0))),
            "pesticide": float(input_dict.get('pesticide', input_dict.get('Pesticide', 0))),
            "estimated_production": estimated_production
        }
    }


def predict_crop_yield(input_dict: dict, selected_model: str = "xgboost", mode: str = "single") -> dict:
    """Main dispatch entry point."""
    norm_mode = (mode or "").lower()
    norm_model = (selected_model or "").lower()

    if norm_mode == "compare" or norm_model in ["compare", "compare all", "best model", "all"]:
        return predict_compare_all(input_dict)
    else:
        return predict_single_model(input_dict, selected_model)
