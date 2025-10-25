import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "./DashboardLayout";
import Overview from "./Overview";
import AspectSentiment from "./AspectSentiment";
import RecentReviews from "./RecentReviews";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("Overview");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- Fetch reviews ----------------
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/recent-reviews");
      setReviews(res.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ---------------- Compute metrics for Overview ----------------
  const computeMetrics = (reviewsList) => {
    let positive = 0, negative = 0, neutral = 0;

    reviewsList.forEach((r) => {
      const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };

      (r.aspects || []).forEach((a) => {
        const s = (a.sentiment || "Neutral").toLowerCase();
        if (s === "positive") sentimentCounts.positive++;
        else if (s === "negative") sentimentCounts.negative++;
        else sentimentCounts.neutral++;
      });

      const maxCount = Math.max(...Object.values(sentimentCounts));
      const dominant = Object.keys(sentimentCounts).find(
        (k) => sentimentCounts[k] === maxCount
      );

      if (dominant === "positive") positive++;
      else if (dominant === "negative") negative++;
      else neutral++;
    });

    return {
      totalReviews: reviewsList.length,
      positive,
      negative,
      neutral,
    };
  };

  const metrics = computeMetrics(reviews);

  // ---------------- Add Review ----------------
  const handleAddReview = async (review) => {
    try {
      const res = await axios.post("http://localhost:5000/api/add-review", review);
      const newReview = res.data.review;
      // Add new review at the beginning to show immediately
      setReviews((prev) => [newReview, ...prev]);
    } catch (err) {
      console.error("Add review error:", err);
      throw err;
    }
  };

  // ---------------- Delete Review ----------------
  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete-review/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete review error:", err);
      throw err;
    }
  };

  // ---------------- Compute top 3 aspects ----------------
  const topOverviewAspects = [...reviews.reduce((map, r) => {
    (r.aspects || []).forEach((a) => {
      const name = a.name || a.aspect || "General";
      if (!map.has(name)) map.set(name, { name, positive: 0, neutral: 0, negative: 0 });
      const s = (a.sentiment || "Neutral").toLowerCase();
      if (s === "positive") map.get(name).positive += 1;
      else if (s === "negative") map.get(name).negative += 1;
      else map.get(name).neutral += 1;
    });
    return map;
  }, new Map()).values()].sort((a, b) => {
    const totalA = a.positive + a.negative + a.neutral;
    const totalB = b.positive + b.negative + b.neutral;
    return totalB - totalA;
  }).slice(0, 3);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading dashboard...</p>;

  return (
    <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {activeSection === "Overview" && (
        <Overview metrics={metrics} topAspects={topOverviewAspects} recentReviews={reviews} />
      )}

      {activeSection === "Aspect Sentiment" && (
        <AspectSentiment reviews={reviews} />
      )}

      {activeSection === "Recent Reviews" && (
        <RecentReviews
          reviews={reviews}
          onAddReview={handleAddReview}
          onDeleteReview={handleDeleteReview}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
