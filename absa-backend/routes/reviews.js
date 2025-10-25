const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const { spawn } = require("child_process");

router.post("/add-review", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    // Call Python ABSA script
    const py = spawn("python", ["C:/ReactProjects/absa/absa_extract.py", text]);

    let result = "";
    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error("Python error:", data.toString());
    });

    py.on("close", async () => {
      let aspects = [];
      try {
        aspects = JSON.parse(result.replace(/'/g, '"'));
      } catch (err) {
        console.error("Error parsing Python output:", err);
      }

      // Format for MongoDB
      const formattedAspects = aspects.map(a => ({
        name: a.aspect || a.name || "General",
        sentiment: a.sentiment || "Neutral"
      }));

      try {
        const newReview = await Review.create({ text, aspects: formattedAspects });
        res.json({ message: "Review added successfully", review: newReview });
      } catch (err) {
        console.error("MongoDB save error:", err);
        res.status(500).json({ message: "Error saving review" });
      }
    });
  } catch (err) {
    console.error("Add review error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ===== Get recent reviews =====
router.get("/recent-reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("Get reviews error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== Dashboard Metrics =====
router.get("/metrics", async (req, res) => {
  try {
    const reviews = await Review.find();
    let positive = 0, negative = 0, neutral = 0;

    reviews.forEach(r => {
      if (!Array.isArray(r.aspects)) return;

      r.aspects.forEach(a => {
        const s = (a.sentiment || "Neutral").toLowerCase();
        if (s === "positive") positive++;
        else if (s === "negative") negative++;
        else neutral++;
      });
    });

    res.json({
      totalReviews: reviews.length,          // total review documents
      totalAspects: positive + negative + neutral,  // sum of all aspect reactions
      positive,
      negative,
      neutral,
    });
  } catch (err) {
    console.error("Metrics error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// ===== Aspect Sentiment =====
router.get("/aspects", async (req, res) => {
  try {
    const reviews = await Review.find();
    const aspectMap = {};

    reviews.forEach(r => {
      if (!Array.isArray(r.aspects)) return;

      r.aspects.forEach(a => {
        // Handle both 'name' or 'aspect' field
        const name = a.name || a.aspect || "General";
        const s = (a.sentiment || "Neutral").toLowerCase();

        if (!aspectMap[name]) aspectMap[name] = { name, positive: 0, negative: 0, neutral: 0 };

        if (s === "positive") aspectMap[name].positive++;
        else if (s === "negative") aspectMap[name].negative++;
        else aspectMap[name].neutral++;
      });
    });

    // Convert to array and sort by total mentions
    const data = Object.values(aspectMap).sort((a, b) => {
      const totalA = a.positive + a.negative + a.neutral;
      const totalB = b.positive + b.negative + b.neutral;
      return totalB - totalA;
    });

    res.json(data);
  } catch (err) {
    console.error("Aspect Sentiment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/delete-review/:id", async (req, res) => {
  try {
    const reviewId = req.params.id.trim(); // remove whitespace/newlines
    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted successfully", reviewId });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
