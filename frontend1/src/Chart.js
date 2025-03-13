import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./styles.css";

const Chart = ({ chartData }) => {
  return (
    <div className="chart-container">
      <h2>📊 Input Data Visualization</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barCategoryGap={15}>
          <XAxis dataKey="name" />
          <YAxis tickSize={10} tickFormatter={(tick) => `${tick}`} />
          <Tooltip />
          <Bar dataKey="value" fill="#007bff" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
