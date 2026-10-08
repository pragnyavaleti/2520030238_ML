from predict import predict_crop_yield

sample_input = {
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

print("Testing Best Model (XGBoost):")
res1 = predict_crop_yield(sample_input, "Best Model")
print(res1)

print("\nTesting Random Forest:")
res2 = predict_crop_yield(sample_input, "Random Forest")
print(res2)

print("\nTesting SVR:")
res3 = predict_crop_yield(sample_input, "SVR")
print(res3)
