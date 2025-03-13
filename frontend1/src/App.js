import React, { useState } from "react";
import Form from "./Form";
import Chart from "./Chart";
import "./styles.css";

const App = () => {
  const [prediction, setPrediction] = useState(null);
  const [chartData, setChartData] = useState([]);

  return (
    <div className="container">
      <h1 className="text-center">🩺 MedGenius AI Disease Diagnosis</h1>

      <Form setPrediction={setPrediction} setChartData={setChartData} />
      <Chart chartData={chartData} />

      {prediction !== null && (
        <div className={`prediction-box ${prediction ? "positive" : "negative"}`}>
          <h2>🩻 Diagnosis Result:</h2>
          <p>{prediction === 1 ? "⚠️ Diabetes Detected" : "✅ No Diabetes Detected"}</p>
        </div>
      )}
    </div>
  );
};

export default App;
