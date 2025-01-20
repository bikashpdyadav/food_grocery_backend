const mongoose = require("mongoose");

// Define schema for badges
const badgeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  image_id: String,
  description: String,
  restaurant_id: {
    type: Number,
    required: true
  }
});

// Create model
const Badge = mongoose.model("Badge", badgeSchema);

module.exports = Badge;
