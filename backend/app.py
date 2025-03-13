from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

@app.route("/")
def home():
    return "AI for Healthcare API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    features = np.array(data["features"]).reshape(1, -1)
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]
    
    precautions = "Eat healthy, exercise regularly, and monitor blood sugar." if prediction == 1 else "Maintain a balanced diet and stay active."
    
    return jsonify({"prediction": int(prediction), "precautions": precautions})

if __name__ == "__main__":
    app.run(debug=True)
