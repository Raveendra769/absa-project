import React from "react";
import "./aspect-dashboard.css"; // use the CSS you shared earlier

const AspectSentimentDashboard = ({ aspectData }) => {
  if (!aspectData || aspectData.length === 0) {
    return <div className="no-data">No aspect data available</div>;
  }

  return (
    <div className="aspect-dashboard">
      {aspectData.map((aspect) => {
        const total = (aspect.Positive || 0) + (aspect.Negative || 0) + (aspect.Neutral || 0);
        const positivePercent = total ? ((aspect.Positive / total) * 100).toFixed(0) : 0;
        const negativePercent = total ? ((aspect.Negative / total) * 100).toFixed(0) : 0;
        const neutralPercent = total ? ((aspect.Neutral / total) * 100).toFixed(0) : 0;

        return (
          <div key={aspect._id} className="aspect-card">
            <h3 className="aspect-title">{aspect._id}</h3>
            <div className="aspect-badges">
              <span className="badge positive">{aspect.Positive} Positive</span>
              <span className="badge negative">{aspect.Negative} Negative</span>
              <span className="badge neutral">{aspect.Neutral} Neutral</span>
            </div>
            <div className="aspect-bars">
              <div
                className="bar positive-bar"
                style={{ width: `${positivePercent}%` }}
                title={`${positivePercent}% Positive`}
              />
              <div
                className="bar negative-bar"
                style={{ width: `${negativePercent}%` }}
                title={`${negativePercent}% Negative`}
              />
              <div
                className="bar neutral-bar"
                style={{ width: `${neutralPercent}%` }}
                title={`${neutralPercent}% Neutral`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AspectSentimentDashboard;
