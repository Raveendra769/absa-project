// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Routes =====
const reviewRoutes = require("./routes/reviews"); // Correct path
const authRoutes = require("./routes/auth");      // Correct path

app.use("/api", reviewRoutes);
app.use("/api/auth", authRoutes);

// ===== MongoDB Connection =====
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/absa_db";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    // Start server only after DB is connected
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
