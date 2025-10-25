import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

const AspectSentiment = ({ reviews = [] }) => {
  if (reviews.length === 0)
    return <p style={{ textAlign: "center" }}>No aspect data yet.</p>;

  // ---------------- Compute aspect counts ----------------
  const aspectMap = {};

  reviews.forEach((r) => {
    (r.aspects || []).forEach((a) => {
      if (!aspectMap[a.name]) {
        aspectMap[a.name] = { name: a.name, positive: 0, neutral: 0, negative: 0 };
      }
      if (a.sentiment === "Positive") aspectMap[a.name].positive += 1;
      else if (a.sentiment === "Negative") aspectMap[a.name].negative += 1;
      else aspectMap[a.name].neutral += 1;
    });
  });

  const aspectData = Object.values(aspectMap);

  // Sort by total mentions
  const sortedAspects = [...aspectData].sort(
    (a, b) =>
      b.positive + b.neutral + b.negative - (a.positive + a.neutral + a.negative)
  );

  // ---------------- Chart.js data ----------------
  const data = {
    labels: sortedAspects.map(a => a.name),
    datasets: [
      { label: "Positive", data: sortedAspects.map(a => a.positive), backgroundColor: "#16a34a" },
      { label: "Neutral", data: sortedAspects.map(a => a.neutral), backgroundColor: "#f59e0b" },
      { label: "Negative", data: sortedAspects.map(a => a.negative), backgroundColor: "#dc2626" },
    ],
  };

  // ---------------- Chart.js options ----------------
  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: { mode: "index", intersect: false },
      datalabels: {
        color: "#fff",
        font: { weight: "bold" },
        anchor: "center",
        align: "center",
        formatter: (value) => (value > 0 ? value : ""), // only show non-zero counts
      },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
      <h3 style={{ textAlign: "center" }}>Aspect Sentiment</h3>
      <Bar data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
};

export default AspectSentiment;
