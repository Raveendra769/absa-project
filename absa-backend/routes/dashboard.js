// routes/dashboard.js
const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Overview metrics
router.get("/overview", async (req, res) => {
  try {
    const total = await Review.countDocuments();
    const positive = await Review.countDocuments({ sentiment: "Positive" });
    const negative = await Review.countDocuments({ sentiment: "Negative" });
    const neutral = await Review.countDocuments({ sentiment: "Neutral" });
    res.json({ total, positive, negative, neutral });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aspect sentiment
router.get("/aspect-sentiment", async (req, res) => {
  try {
    const aspects = ["Delivery", "Quality", "Service", "Price", "Support"];
    const data = {};
    for (const aspect of aspects) {
      data[aspect] = {
        Positive: await Review.countDocuments({ aspect, sentiment: "Positive" }),
        Negative: await Review.countDocuments({ aspect, sentiment: "Negative" }),
        Neutral: await Review.countDocuments({ aspect, sentiment: "Neutral" }),
      };
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recent reviews
router.get("/recent-reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(10);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
