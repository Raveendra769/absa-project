// seedReviews.js.js
const mongoose = require("mongoose");
const Review = require("./models/Review"); // adjust path if needed
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Delete old reviews
    await Review.deleteMany({});
    console.log("Old reviews deleted");

    // Sample reviews
    const reviews = [
      {
        text: "The service was excellent and staff was very friendly.",
        aspects: [{ name: "Service", sentiment: "Positive" }],
      },
      {
        text: "Food was too salty for my taste.",
        aspects: [{ name: "Food", sentiment: "Negative" }],
      },
      {
        text: "Ambience is okay, nothing special.",
        aspects: [{ name: "Ambience", sentiment: "Neutral" }],
      },
      {
        text: "Loved the quick delivery and packaging.",
        aspects: [{ name: "Delivery", sentiment: "Positive" }],
      },
      {
        text: "The app crashed a few times while ordering.",
        aspects: [{ name: "App", sentiment: "Negative" }],
      },
    ];

    // Insert sample reviews
    await Review.insertMany(reviews);
    console.log("Database seeded successfully!");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
