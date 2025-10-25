const mongoose = require("mongoose");

const AspectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sentiment: { type: String, enum: ["Positive", "Negative", "Neutral"], default: "Neutral" },
});

const ReviewSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    aspects: {
      type: [AspectSchema],
      required: true,
      validate: [arr => arr.length > 0, "At least one aspect is required"],
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("Review", ReviewSchema);
