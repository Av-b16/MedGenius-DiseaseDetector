import React from "react";
import "./styles.css";

const Result = ({ prediction }) => {
  return (
    <div className="result-container">
      {prediction ? <h3>Result: {prediction}</h3> : <h3>Enter details to predict</h3>}
    </div>
  );
};

export default Result;
