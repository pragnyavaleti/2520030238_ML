import os
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR
from sklearn.compose import TransformedTargetRegressor
from sklearn.preprocessing import QuantileTransformer
from xgboost import XGBRegressor

from preprocessing import AgriculturalPreprocessor, TARGET_COL
from evaluate import evaluate_model, determine_best_model, save_model_results

def train_and_evaluate_all():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    train_dataset_path = os.path.join(base_dir, '..', 'dataset', 'crop_yield_train.csv')
    test_dataset_path = os.path.join(base_dir, '..', 'dataset', 'crop_yield_test(6).csv')
    saved_models_dir = os.path.join(base_dir, 'saved_models')
    os.makedirs(saved_models_dir, exist_ok=True)

    print("==========================================================", flush=True)
    print("  Training & Evaluating Crop Yield Models (Official Data)", flush=True)
    print("==========================================================", flush=True)
    print(f"Loading training dataset from: {train_dataset_path}", flush=True)
    print(f"Loading verification test dataset from: {test_dataset_path}", flush=True)

    if not os.path.exists(train_dataset_path):
        raise FileNotFoundError(f"Training dataset not found at {train_dataset_path}")
    if not os.path.exists(test_dataset_path):
        raise FileNotFoundError(f"Test dataset not found at {test_dataset_path}")

    df_train = pd.read_csv(train_dataset_path)
    df_test = pd.read_csv(test_dataset_path)

    print(f"Raw Dataset Counts: {len(df_train)} train rows, {len(df_test)} test rows.", flush=True)

    # 1. Preprocessing & Feature Engineering
    preprocessor = AgriculturalPreprocessor()
    preprocessor.fit(df_train, df_test=df_test)
    preprocessor_path = os.path.join(saved_models_dir, 'preprocessor.pkl')
    preprocessor.save(preprocessor_path)

    df_train_clean = preprocessor.clean_data(df_train)
    df_test_clean = preprocessor.clean_data(df_test)

    y_train = df_train_clean[TARGET_COL].values
    y_test = df_test_clean[TARGET_COL].values

    # Unscaled features for tree-based models (RF, XGBoost)
    X_train_unscaled = preprocessor.transform(df_train_clean, is_scaled=False)
    X_test_unscaled = preprocessor.transform(df_test_clean, is_scaled=False)

    # Scaled features for SVR
    X_train_scaled = preprocessor.transform(df_train_clean, is_scaled=True)
    X_test_scaled = preprocessor.transform(df_test_clean, is_scaled=True)

    print(f"Final Samples: {len(X_train_unscaled)} training samples, {len(X_test_unscaled)} test samples.", flush=True)

    metrics_list = []

    # ----------------------------------------------------
    # Model 1: XGBoost Regressor
    # ----------------------------------------------------
    print("\n--- Training Model 1: XGBoost Regressor ---", flush=True)
    xgb_model = XGBRegressor(
        n_estimators=150,
        learning_rate=0.08,
        max_depth=6,
        subsample=0.85,
        colsample_bytree=0.85,
        random_state=42,
        n_jobs=-1
    )
    xgb_model.fit(X_train_unscaled, y_train)
    xgb_pred = xgb_model.predict(X_test_unscaled)
    xgb_metrics = evaluate_model("XGBoost", y_test, xgb_pred)
    xgb_metrics["feature_importances"] = dict(zip(
        preprocessor.feature_columns,
        [round(float(v), 4) for v in xgb_model.feature_importances_]
    ))
    metrics_list.append(xgb_metrics)
    joblib.dump(xgb_model, os.path.join(saved_models_dir, 'xgboost.pkl'))
    print(f"XGBoost Metrics: R2={xgb_metrics['r2_score']} ({xgb_metrics['r2_percentage']}%), RMSE={xgb_metrics['rmse']}, MAE={xgb_metrics['mae']}", flush=True)

    # ----------------------------------------------------
    # Model 2: Random Forest Regressor
    # ----------------------------------------------------
    print("\n--- Training Model 2: Random Forest Regressor ---", flush=True)
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=16,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train_unscaled, y_train)
    rf_pred = rf_model.predict(X_test_unscaled)
    rf_metrics = evaluate_model("Random Forest", y_test, rf_pred)
    rf_metrics["feature_importances"] = dict(zip(
        preprocessor.feature_columns,
        [round(float(v), 4) for v in rf_model.feature_importances_]
    ))
    metrics_list.append(rf_metrics)
    joblib.dump(rf_model, os.path.join(saved_models_dir, 'random_forest.pkl'))
    print(f"Random Forest Metrics: R2={rf_metrics['r2_score']} ({rf_metrics['r2_percentage']}%), RMSE={rf_metrics['rmse']}, MAE={rf_metrics['mae']}", flush=True)

    # ----------------------------------------------------
    # Model 3: Support Vector Regression (SVR)
    # ----------------------------------------------------
    print("\n--- Training Model 3: Support Vector Regression (SVR) ---", flush=True)
    svr_model = TransformedTargetRegressor(
        regressor=SVR(
            kernel='rbf',
            C=10.0,
            epsilon=0.1,
            cache_size=1000
        ),
        transformer=QuantileTransformer(n_quantiles=1000, output_distribution='normal', random_state=42)
    )
    svr_model.fit(X_train_scaled, y_train)
    svr_pred = svr_model.predict(X_test_scaled)
    svr_metrics = evaluate_model("Support Vector Regression (SVR)", y_test, svr_pred)
    metrics_list.append(svr_metrics)
    joblib.dump(svr_model, os.path.join(saved_models_dir, 'svr.pkl'))
    print(f"SVR Metrics: R2={svr_metrics['r2_score']} ({svr_metrics['r2_percentage']}%), RMSE={svr_metrics['rmse']}, MAE={svr_metrics['mae']}", flush=True)

    # ----------------------------------------------------
    # Model Comparison & Best Benchmark Model Selection
    # ----------------------------------------------------
    best_model_info = determine_best_model(metrics_list)
    print(f"\n[BENCHMARK WINNER] Top Holdout Model: {best_model_info['best_model_name']}", flush=True)

    final_results = {
        "dataset_summary": {
            "total_records": len(df_train_clean) + len(df_test_clean),
            "train_size": len(X_train_unscaled),
            "test_size": len(X_test_unscaled),
            "features_count": len(preprocessor.feature_columns),
            "features": preprocessor.feature_columns,
            "target": TARGET_COL,
            "states": preprocessor.stats["categories"].get("State", []),
            "crops": preprocessor.stats["categories"].get("Crop", []),
            "seasons": preprocessor.stats["categories"].get("Season", [])
        },
        "models": metrics_list,
        "best_model": best_model_info
    }

    results_path = os.path.join(base_dir, 'model_results.json')
    save_model_results(final_results, results_path)
    print("\nAll models and evaluation metrics successfully updated on actual dataset!", flush=True)
    return final_results

if __name__ == '__main__':
    train_and_evaluate_all()
