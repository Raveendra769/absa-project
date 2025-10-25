import React, { useState } from "react";

const RecentReviews = ({ reviews = [], onAddReview, onDeleteReview }) => {
  const [newReviewText, setNewReviewText] = useState("");
  const [newAspect, setNewAspect] = useState("");
  const [newSentiment, setNewSentiment] = useState("Neutral");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // ---------------- Add Review ----------------
  const handleAdd = async () => {
    if (!newReviewText.trim() || !newAspect.trim()) {
      setError("Review text and aspect are required");
      return;
    }

    setError("");
    setLoading(true);

    const reviewPayload = {
      text: newReviewText,
      aspects: [{ name: newAspect, sentiment: newSentiment }],
    };

    try {
      await onAddReview(reviewPayload);
      setMessage("✅ Review added successfully!");
      setTimeout(() => setMessage(""), 3000);

      setNewReviewText("");
      setNewAspect("");
      setNewSentiment("Neutral");
    } catch (err) {
      console.error(err);
      setError("Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Delete Review ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await onDeleteReview(id);
      setMessage("🗑️ Review deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to delete review");
    }
  };

  // ---------------- Filtered Reviews ----------------
  const filteredReviews = reviews.filter(
    (r) =>
      (r.text || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (r.aspects || []).some((a) =>
        (a.name || "").toLowerCase().includes(searchText.toLowerCase())
      )
  );

  const sentimentColor = (sentiment) =>
    sentiment === "Positive" ? "#4caf50" : sentiment === "Negative" ? "#f44336" : "#ff9800";

  return (
    <div style={{ padding: 20 }}>
      {/* Success/Error message */}
      {(message || error) && (
        <div
          style={{
            background: message ? "#e8f5e9" : "#ffebee",
            color: message ? "#2e7d32" : "#c62828",
            padding: "10px 15px",
            borderRadius: 8,
            marginBottom: 20,
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {message || error}
        </div>
      )}

      {/* Add Review Form */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
          marginBottom: 30,
        }}
      >
        <h2 style={{ marginBottom: 15 }}>Add a Review</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="text"
            placeholder="Review text"
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Aspect"
            value={newAspect}
            onChange={(e) => setNewAspect(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
          />
          <select
            value={newSentiment}
            onChange={(e) => setNewSentiment(e.target.value)}
            style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
          >
            <option>Positive</option>
            <option>Neutral</option>
            <option>Negative</option>
          </select>
          <button
            onClick={handleAdd}
            disabled={loading}
            style={{
              padding: 12,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              color: "#fff",
              background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
            }}
          >
            {loading ? "Adding..." : "Add Review"}
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search reviews..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          padding: 10,
          marginBottom: 20,
          width: "100%",
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      {/* Reviews List */}
      <div style={{ display: "grid", gap: 15 }}>
        {filteredReviews.length === 0 && (
          <p style={{ textAlign: "center" }}>No reviews found.</p>
        )}
        {filteredReviews.map((r) =>
          (r.aspects || []).map((a, i) => (
            <div
              key={r._id + "-" + i}
              style={{
                background: "#f9fafb",
                padding: 15,
                borderRadius: 12,
                boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{a.name || "Unnamed Aspect"}</p>

                {/* Sentiment Badge */}
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: 12,
                    color: "#fff",
                    fontWeight: 600,
                    background: sentimentColor(a.sentiment || "Neutral"),
                    marginBottom: 5,
                  }}
                >
                  {a.sentiment || "Neutral"}
                </span>

                <p style={{ margin: "5px 0 0 0" }}>{r.text || "No review text"}</p>
              </div>
              <button
                onClick={() => handleDelete(r._id)}
                style={{
                  color: "red",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentReviews;
