const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Simulated ABSA (replace with ML logic later)
function analyzeComment(comment) {
  // Simple example:
  const lower = comment.toLowerCase();
  let sentiment = "Neutral";
  if (lower.includes("good") || lower.includes("excellent")) sentiment = "Positive";
  if (lower.includes("bad") || lower.includes("poor")) sentiment = "Negative";

  // Aspect detection
  let aspect = "General";
  if (lower.includes("ui") || lower.includes("design")) aspect = "UI";
  if (lower.includes("performance") || lower.includes("speed")) aspect = "Performance";

  return { sentiment, aspect };
}

// Analyze review before saving
router.post("/analyze", async (req, res) => {
  try {
    const { user, comment } = req.body;
    const { sentiment, aspect } = analyzeComment(comment);

    const review = new Review({ user, comment, sentiment, aspect });
    await review.save();

    res.status(201).json({ message: "Review analyzed and saved", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
