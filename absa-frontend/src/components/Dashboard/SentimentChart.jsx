import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SentimentChart = ({ metrics }) => {
  if (!metrics) return null;

  const data = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        label: "Number of Reviews",
        data: [metrics.positive || 0, metrics.negative || 0, metrics.neutral || 0],
        backgroundColor: ["#4caf50", "#f44336", "#ff9800"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Sentiment Distribution" },
    },
  };

  return <Bar data={data} options={options} />;
};

export default SentimentChart;
