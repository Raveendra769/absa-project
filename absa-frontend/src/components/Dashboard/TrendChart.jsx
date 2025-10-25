import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";


const TrendChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard/sentiment-trends")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-semibold mb-4">Sentiment Trends</h2>
      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Positive" stroke="#4CAF50" />
            <Line type="monotone" dataKey="Negative" stroke="#F44336" />
            <Line type="monotone" dataKey="Neutral" stroke="#9E9E9E" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TrendChart;
