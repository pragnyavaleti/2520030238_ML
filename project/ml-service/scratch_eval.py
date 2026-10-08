import joblib
import pandas as pd
import numpy as np

prep = joblib.load('saved_models/preprocessor.pkl')
xgb = joblib.load('saved_models/xgboost.pkl')
rf = joblib.load('saved_models/random_forest.pkl')
svr = joblib.load('saved_models/svr.pkl')

presets = [
  {'label': 'Punjab Wheat (Rabi)', 'year': 2023, 'state': 'Punjab', 'crop': 'Wheat', 'season': 'Rabi', 'area': 2500, 'annualRainfall': 650, 'fertilizer': 280000, 'pesticide': 20000},
  {'label': 'West Bengal Rice (Kharif)', 'year': 2022, 'state': 'West Bengal', 'crop': 'Rice', 'season': 'Kharif', 'area': 3200, 'annualRainfall': 1650, 'fertilizer': 350000, 'pesticide': 26000},
  {'label': 'Maharashtra Sugarcane (Whole Year)', 'year': 2023, 'state': 'Maharashtra', 'crop': 'Sugarcane', 'season': 'Whole Year', 'area': 1800, 'annualRainfall': 1100, 'fertilizer': 420000, 'pesticide': 32000},
  {'label': 'Gujarat Cotton (Kharif)', 'year': 2021, 'state': 'Gujarat', 'crop': 'Cotton', 'season': 'Kharif', 'area': 4000, 'annualRainfall': 820, 'fertilizer': 320000, 'pesticide': 28000},
  {'label': 'Madhya Pradesh Soybean (Kharif)', 'year': 2022, 'state': 'Madhya Pradesh', 'crop': 'Soybean', 'season': 'Kharif', 'area': 3500, 'annualRainfall': 1050, 'fertilizer': 260000, 'pesticide': 21000},
  {'label': 'Rajasthan Mustard (Rabi)', 'year': 2023, 'state': 'Rajasthan', 'crop': 'Mustard', 'season': 'Rabi', 'area': 2800, 'annualRainfall': 480, 'fertilizer': 140000, 'pesticide': 12000},
  {'label': 'Karnataka Maize (Kharif)', 'year': 2022, 'state': 'Karnataka', 'crop': 'Maize', 'season': 'Kharif', 'area': 2200, 'annualRainfall': 1150, 'fertilizer': 240000, 'pesticide': 18000},
  {'label': 'Tamil Nadu Groundnut (Rabi)', 'year': 2023, 'state': 'Tamil Nadu', 'crop': 'Groundnut', 'season': 'Rabi', 'area': 1900, 'annualRainfall': 960, 'fertilizer': 210000, 'pesticide': 15000},
  {'label': 'Bihar Pulses (Zaid)', 'year': 2022, 'state': 'Bihar', 'crop': 'Pulses', 'season': 'Zaid', 'area': 1600, 'annualRainfall': 1200, 'fertilizer': 120000, 'pesticide': 9500},
  {'label': 'Assam Jute (Kharif)', 'year': 2023, 'state': 'Assam', 'crop': 'Jute', 'season': 'Kharif', 'area': 1500, 'annualRainfall': 2200, 'fertilizer': 135000, 'pesticide': 11000}
]

df = pd.read_csv('../dataset/crop_yield.csv')

print(f"{'Preset Label':<35} | {'Hist Avg':<8} | {'XGBoost':<8} | {'RF':<8} | {'SVR':<8}")
print('-' * 75)

for p in presets:
    subset = df[(df['Crop'] == p['crop']) & (df['State'] == p['state'])]
    hist_avg = subset['Yield'].mean() if len(subset) > 0 else df[df['Crop'] == p['crop']]['Yield'].mean()
    
    x_unscaled = prep.transform_single(p, is_scaled=False)
    x_scaled = prep.transform_single(p, is_scaled=True)
    
    yp_xgb = float(xgb.predict(x_unscaled)[0])
    yp_rf = float(rf.predict(x_unscaled)[0])
    yp_svr = float(svr.predict(x_scaled)[0])
    
    print(f"{p['label']:<35} | {hist_avg:<8.2f} | {yp_xgb:<8.2f} | {yp_rf:<8.2f} | {yp_svr:<8.2f}")
