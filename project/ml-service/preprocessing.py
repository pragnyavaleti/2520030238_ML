import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib

CATEGORICAL_COLS = ['State', 'Crop', 'Season']
NUMERICAL_COLS = ['Year', 'Area', 'Annual_Rainfall', 'Fertilizer', 'Pesticide', 'Fert_Per_Ha', 'Pest_Per_Ha']
TARGET_COL = 'Yield'

class AgriculturalPreprocessor:
    def __init__(self):
        self.encoders = {}
        self.scaler = StandardScaler()
        self.mean_maps = {}
        self.global_mean_yield = 96.88
        self.crop_baselines = {}
        self.feature_columns = [
            'Year', 'Area', 'Annual_Rainfall', 'Fertilizer', 'Pesticide',
            'Fert_Per_Ha', 'Pest_Per_Ha',
            'State_Code', 'Crop_Code', 'Season_Code',
            'State_Mean', 'Crop_Mean', 'Season_Mean'
        ]
        self.is_fitted = False
        self.stats = {}

    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Handle missing values, duplicates, and non-negative constraints."""
        initial_count = len(df)
        df_clean = df.copy()

        # Remove duplicate records
        df_clean = df_clean.drop_duplicates()

        # Handle missing values
        if TARGET_COL in df_clean.columns:
            df_clean = df_clean.dropna(subset=[TARGET_COL])
            df_clean = df_clean[(df_clean['Area'] > 0) & (df_clean[TARGET_COL] >= 0)]
        else:
            df_clean = df_clean[df_clean['Area'] > 0]

        for col in ['Year', 'Area', 'Annual_Rainfall', 'Fertilizer', 'Pesticide']:
            if col in df_clean.columns:
                median_val = df_clean[col].median()
                df_clean[col] = df_clean[col].fillna(median_val)

        for col in CATEGORICAL_COLS:
            if col in df_clean.columns:
                mode_val = df_clean[col].mode()[0]
                df_clean[col] = df_clean[col].fillna(mode_val)

        # Engineered domain features: nutrient & pesticide intensity per hectare
        df_clean['Fert_Per_Ha'] = df_clean['Fertilizer'] / df_clean['Area'].replace(0, np.nan).fillna(1.0)
        df_clean['Pest_Per_Ha'] = df_clean['Pesticide'] / df_clean['Area'].replace(0, np.nan).fillna(1.0)

        print(f"Data Cleaning: {initial_count} rows -> {len(df_clean)} valid rows.", flush=True)
        return df_clean

    def fit(self, df_train: pd.DataFrame, df_test: pd.DataFrame = None):
        """Fit encoders, mean maps, and scaler on training dataset."""
        df_clean = self.clean_data(df_train)

        self.global_mean_yield = float(df_clean[TARGET_COL].mean())

        # Fit LabelEncoders on union of train and test categories to avoid unseen category errors
        for col in CATEGORICAL_COLS:
            train_cats = set(df_clean[col].astype(str).str.strip())
            if df_test is not None and col in df_test.columns:
                test_cats = set(df_test[col].astype(str).str.strip())
                all_cats = sorted(list(train_cats.union(test_cats)))
            else:
                all_cats = sorted(list(train_cats))
            
            le = LabelEncoder()
            le.fit(all_cats)
            self.encoders[col] = le
            
            # Target mean map computed strictly from train set
            mean_dict = df_clean.groupby(col)[TARGET_COL].mean().to_dict()
            self.mean_maps[col] = {str(k).strip(): float(v) for k, v in mean_dict.items()}

        # Store baseline mean yields for all crops for dynamic productivity index calculation
        self.crop_baselines = self.mean_maps.get('Crop', {})

        # Compute dataset stats for EDA
        self.stats = {
            "total_records": len(df_clean),
            "columns": list(df_clean.columns),
            "categories": {col: sorted(list(self.encoders[col].classes_)) for col in CATEGORICAL_COLS},
            "numerical_summary": {}
        }

        for col in ['Year', 'Area', 'Annual_Rainfall', 'Fertilizer', 'Pesticide', 'Fert_Per_Ha', 'Pest_Per_Ha']:
            self.stats["numerical_summary"][col] = {
                "min": float(df_clean[col].min()),
                "max": float(df_clean[col].max()),
                "mean": float(df_clean[col].mean()),
                "median": float(df_clean[col].median())
            }

        # Build feature DataFrame
        feature_df = self._build_features(df_clean)
        self.scaler.fit(feature_df)
        self.is_fitted = True
        return self

    def _build_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Internal helper to construct full feature matrix."""
        df_copy = df.copy()

        if 'Fert_Per_Ha' not in df_copy.columns:
            area = df_copy['Area'].replace(0, np.nan).fillna(1.0)
            df_copy['Fert_Per_Ha'] = df_copy['Fertilizer'] / area
        if 'Pest_Per_Ha' not in df_copy.columns:
            area = df_copy['Area'].replace(0, np.nan).fillna(1.0)
            df_copy['Pest_Per_Ha'] = df_copy['Pesticide'] / area

        feat_dict = {
            'Year': df_copy['Year'].values,
            'Area': df_copy['Area'].values,
            'Annual_Rainfall': df_copy['Annual_Rainfall'].values,
            'Fertilizer': df_copy['Fertilizer'].values,
            'Pesticide': df_copy['Pesticide'].values,
            'Fert_Per_Ha': df_copy['Fert_Per_Ha'].values,
            'Pest_Per_Ha': df_copy['Pesticide'] / df_copy['Area'].replace(0, np.nan).fillna(1.0),
        }

        for col in CATEGORICAL_COLS:
            le = self.encoders[col]
            series = df_copy[col].astype(str).str.strip()
            code_col = col + '_Code'
            mean_col = col + '_Mean'
            
            # Map code
            mapped_codes = series.map(lambda s: le.transform([s])[0] if s in le.classes_ else 0)
            feat_dict[code_col] = mapped_codes.values

            # Map mean
            mean_map = self.mean_maps.get(col, {})
            mapped_means = series.map(lambda s: mean_map.get(s, self.global_mean_yield))
            feat_dict[mean_col] = mapped_means.values

        res_df = pd.DataFrame(feat_dict, index=df_copy.index)
        return res_df[self.feature_columns]

    def transform(self, df: pd.DataFrame, is_scaled=False) -> np.ndarray:
        """Transform dataframe into feature matrix."""
        if not self.is_fitted:
            raise ValueError("Preprocessor has not been fitted yet.")

        feature_df = self._build_features(df)
        if is_scaled:
            return self.scaler.transform(feature_df)
        return feature_df.values

    def transform_single(self, input_data: dict, is_scaled=False) -> np.ndarray:
        """Transform a single input dictionary for real-time inference."""
        area_val = float(input_data.get('area', input_data.get('Area', 1000)))
        fert_val = float(input_data.get('fertilizer', input_data.get('Fertilizer', 200000)))
        pest_val = float(input_data.get('pesticide', input_data.get('Pesticide', 15000)))

        fert_per_ha = (fert_val / area_val) if area_val > 0 else 150.0
        pest_per_ha = (pest_val / area_val) if area_val > 0 else 10.0

        df_single = pd.DataFrame([{
            'Year': float(input_data.get('year', input_data.get('Year', 2023))),
            'State': str(input_data.get('state', input_data.get('State', 'Punjab'))).strip(),
            'Crop': str(input_data.get('crop', input_data.get('Crop', 'Wheat'))).strip(),
            'Season': str(input_data.get('season', input_data.get('Season', 'Rabi'))).strip(),
            'Area': area_val,
            'Annual_Rainfall': float(input_data.get('annualRainfall', input_data.get('Annual_Rainfall', 800))),
            'Fertilizer': fert_val,
            'Pesticide': pest_val,
            'Fert_Per_Ha': fert_per_ha,
            'Pest_Per_Ha': pest_per_ha
        }])
        return self.transform(df_single, is_scaled=is_scaled)

    def get_crop_baseline(self, crop_name: str) -> float:
        """Return dynamic baseline mean yield for this crop from historical dataset."""
        cleaned = str(crop_name).strip()
        # Direct lookup or title-cased lookup
        if cleaned in self.crop_baselines:
            return self.crop_baselines[cleaned]
        for k, v in self.crop_baselines.items():
            if k.lower() == cleaned.lower():
                return v
        return self.global_mean_yield

    def save(self, filepath: str):
        """Save preprocessor pipeline to disk."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump(self, filepath)
        print(f"Preprocessor saved to {filepath}", flush=True)

    @classmethod
    def load(cls, filepath: str):
        """Load preprocessor pipeline from disk."""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Preprocessor file not found at: {filepath}")
        return joblib.load(filepath)
