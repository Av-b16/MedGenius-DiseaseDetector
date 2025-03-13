import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaFileDownload } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap"; // For popups
import jsPDF from "jspdf"; // For PDF export
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styling
import "./styles.css"; // Your custom styles

const Form = ({ setChartData }) => {
  const [formData, setFormData] = useState({
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    bmi: "",
    diabetesPedigreeFunction: "",
    age: "",
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("predictionHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const features = Object.values(formData).map(Number);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        features: features,
      });

      setPrediction(response.data.prediction);
      setChartData(features.map((value, index) => ({
        name: Object.keys(formData)[index],
        value,
      })));

      // Store in history
      const newRecord = { formData, prediction: response.data.prediction, time: new Date().toLocaleString() };
      const updatedHistory = [newRecord, ...history];
      localStorage.setItem("predictionHistory", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);

      setShowModal(true); // Show results in modal
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  // Download Report as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Diabetes Prediction Report", 20, 20);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`Prediction: ${prediction ? "Diabetes Detected" : "No Diabetes"}`, 20, 40);
    doc.save("diabetes_report.pdf");
  };

  return (
    <div className="form-container">
      <h2 className="title">Disease Diagnosis</h2>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              type="number"
              name={key}
              placeholder={key.replace(/([A-Z])/g, " $1")}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          ))}
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? <AiOutlineLoading3Quarters className="spinner" /> : "Predict"}
          </button>
        </form>
      </div>

      {/* 🔹 Popup Modal for Predictions */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Prediction Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>{prediction ? "⚠️ Diabetes Detected" : "✅ No Diabetes"}</h3>
          <Button variant="success" onClick={downloadPDF}>
            <FaFileDownload /> Download Report
          </Button>
        </Modal.Body>
      </Modal>

      {/* 🔹 History of Predictions */}
      <div className="history-container">
        <h3>Previous Tests</h3>
        <ul>
          {history.map((item, index) => (
            <li key={index}>
              {item.time} - <strong>{item.prediction ? "Diabetes Detected" : "No Diabetes"}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Form;
