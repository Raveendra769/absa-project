import React from "react";
import { FaChartBar, FaSmile, FaFrown, FaMeh } from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Overview = ({ metrics = {}, topAspects = [], recentReviews = [] }) => {
  // ✅ Correct destructuring to match backend keys
  const { totalReviews = 0, positive = 0, negative = 0, neutral = 0 } = metrics;

  // Metric Cards
  const cards = [
    { label: "Total Reviews", value: totalReviews, icon: <FaChartBar />, color: "#3b82f6" },
    { label: "Positive", value: positive, icon: <FaSmile />, color: "#16a34a" },
    { label: "Negative", value: negative, icon: <FaFrown />, color: "#dc2626" },
    { label: "Neutral", value: neutral, icon: <FaMeh />, color: "#f59e0b" },
  ];

  // Sentiment Pie Chart
  const sentimentData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        label: "Sentiment",
        data: [positive, negative, neutral],
        backgroundColor: ["#16a34a", "#dc2626", "#f59e0b"],
      },
    ],
  };

  // Top Aspects Bar Chart
  const processedAspects = Array.isArray(topAspects) ? topAspects : [];
  const aspectsData = {
    labels: processedAspects.map(a => a.name),
    datasets: [
      {
        label: "Positive",
        data: processedAspects.map(a => a.positive),
        backgroundColor: "#16a34a",
      },
      {
        label: "Negative",
        data: processedAspects.map(a => a.negative),
        backgroundColor: "#dc2626",
      },
      {
        label: "Neutral",
        data: processedAspects.map(a => a.neutral),
        backgroundColor: "#f59e0b",
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {cards.map(card => (
          <div
            key={card.label}
            style={{
              background: "#f9fafb",
              padding: 20,
              borderRadius: 12,
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
            }}
          >
            <div style={{ fontSize: "2rem", marginRight: 15, color: card.color }}>
              {card.icon}
            </div>
            <div>
              <h4 style={{ margin: 0, color: "#111827", fontWeight: 600 }}>{card.label}</h4>
              <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 40,
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        {/* Overall Sentiment Pie Chart */}
        <div style={{ flex: "0 0 250px", textAlign: "center" }}>
          <h3>Overall Sentiment</h3>
          <div style={{ width: 250, height: 250, margin: "0 auto" }}>
            <Pie
              data={sentimentData}
              options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }}
              width={250}
              height={250}
            />
          </div>
        </div>

        {/* Top Aspects Stacked Bar Chart */}
        <div style={{ flex: "1 1 400px", minWidth: 300 }}>
          <h3>Top Aspects (Sentiment Breakdown)</h3>
          {processedAspects.length > 0 ? (
            <Bar
              key={JSON.stringify(topAspects)} // Forces re-render on data change
              data={aspectsData}
              options={{
                indexAxis: "y",
                responsive: true,
                plugins: { legend: { position: "bottom" } },
                scales: { x: { stacked: true }, y: { stacked: true } },
              }}
            />
          ) : (
            <p>No Top Aspects data available yet.</p>
          )}
        </div>
      </div>

      {/* Top 3 Reviews */}
      {recentReviews.length > 0 && (
        <div>
          <h3>Top Reviews</h3>
          <ul>
            {recentReviews.slice(0, 3).map((review, i) => (
              <li key={i} style={{ marginBottom: 10 }}>
                "{review.text}" — <b>{review.user || "Anonymous"}</b>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Overview;
