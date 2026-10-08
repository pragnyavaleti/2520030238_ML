import json
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def evaluate_model(model_name: str, y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    """Calculate exact MAE, MSE, RMSE, and R2 score on unrounded predictions."""
    mae = float(mean_absolute_error(y_true, y_pred))
    mse = float(mean_squared_error(y_true, y_pred))
    rmse = float(np.sqrt(mse))
    r2 = float(r2_score(y_true, y_pred))

    return {
        "model_name": model_name,
        "mae": round(mae, 4),
        "mse": round(mse, 4),
        "rmse": round(rmse, 4),
        "r2_score": round(r2, 4),
        "r2_percentage": round(r2 * 100.0, 2),
        "raw_metrics": {
            "mae": mae,
            "mse": mse,
            "rmse": rmse,
            "r2_score": r2
        },
        "test_samples": int(len(y_true))
    }

def determine_best_model(metrics_list: list) -> dict:
    """
    Select best historical benchmark model based on highest R2 Score on the holdout test set.
    """
    if not metrics_list:
        return {}

    sorted_models = sorted(
        metrics_list,
        key=lambda m: (-m['r2_score'], m['rmse'], m['mae'])
    )
    best = sorted_models[0]
    return {
        "best_model_name": best["model_name"],
        "reason": f"Achieved highest R² score of {best['r2_score']} ({best['r2_percentage']}%) and lowest RMSE of {best['rmse']} on {best.get('test_samples', 4350)} test samples.",
        "metrics": best
    }

def save_model_results(results: dict, filepath: str):
    """Save evaluation metrics to JSON file."""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    print(f"Model results saved to {filepath}", flush=True)
