import React, { useState, useMemo } from "react";
import AddReviewForm from "./AddReviewForm";

const ITEMS_PER_PAGE = 5;

const sentimentColors = {
  Positive: "#16a34a",
  Negative: "#dc2626",
  Neutral: "#f59e0b",
};

const RecentReviews = ({ reviews = [], onDeleteReview, onAddReview }) => {
  const [filterAspect, setFilterAspect] = useState("");
  const [filterSentiment, setFilterSentiment] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");

  // Flatten reviews with multiple aspects safely
  const flatReviews = useMemo(() => {
    const arr = [];
    (reviews || []).forEach((r) => {
      if (r.aspects && Array.isArray(r.aspects)) {
        r.aspects.forEach((a) => {
          arr.push({
            _id: r._id,
            text: r.text,
            aspect: a.name,
            sentiment: a.sentiment,
          });
        });
      }
    });
    return arr;
  }, [reviews]);

  const aspects = [...new Set(flatReviews.map((r) => r.aspect))];
  const sentiments = [...new Set(flatReviews.map((r) => r.sentiment))];

  const filteredReviews = useMemo(() => {
    return flatReviews.filter(
      (r) =>
        (filterAspect === "" || r.aspect === filterAspect) &&
        (filterSentiment === "" || r.sentiment === filterSentiment) &&
        r.text.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [flatReviews, filterAspect, filterSentiment, searchText]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Delete review
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await onDeleteReview(id);
      setSuccessMsg("Review deleted successfully! ✅");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Delete review error:", err);
      alert("Error deleting review");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      {/* Add Review Form */}
      <AddReviewForm
        onReviewAdded={(review) => {
          onAddReview(review);
          setSuccessMsg("Review added successfully! ✅");
          setTimeout(() => setSuccessMsg(""), 3000);
        }}
      />

      {/* Success Toast */}
      {successMsg && (
        <div
          style={{
            backgroundColor: "#16a34a",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "5px",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          {successMsg}
        </div>
      )}

      <h2 style={{ margin: "20px 0" }}>Recent Reviews</h2>

      {/* Filters */}
      <div
        style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 15 }}
      >
        <input
          placeholder="Search text..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" }}
        />
        <select
          value={filterAspect}
          onChange={(e) => {
            setFilterAspect(e.target.value);
            setCurrentPage(1);
          }}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="">All Aspects</option>
          {aspects.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <select
          value={filterSentiment}
          onChange={(e) => {
            setFilterSentiment(e.target.value);
            setCurrentPage(1);
          }}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="">All Sentiments</option>
          {sentiments.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Reviews Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 15 }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={thStyle}>Aspect</th>
            <th style={thStyle}>Sentiment</th>
            <th style={thStyle}>Review</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedReviews.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                style={{ textAlign: "center", padding: 15, color: "#6b7280" }}
              >
                No reviews found.
              </td>
            </tr>
          ) : (
            paginatedReviews.map((r) => (
              <tr key={r._id + r.aspect} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={tdStyle}>{r.aspect}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      backgroundColor: sentimentColors[r.sentiment] || "#ddd",
                      padding: "4px 8px",
                      borderRadius: 6,
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  >
                    {r.sentiment}
                  </span>
                </td>
                <td style={tdStyle}>{r.text}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDelete(r._id)}
                    style={{
                      backgroundColor: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "5px 10px",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#dc2626")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#ef4444")}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 30 }}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #ccc",
                backgroundColor: currentPage === i + 1 ? "#2563eb" : "#fff",
                color: currentPage === i + 1 ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const thStyle = { textAlign: "left", padding: "10px", fontWeight: 600 };
const tdStyle = { padding: "10px" };

export default RecentReviews;
