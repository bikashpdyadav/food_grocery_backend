const mongoose = require("mongoose");

// Define schema for restaurants
const restaurantSchema = new mongoose.Schema({
  rt_id: {
    type: String,
  },
  rt_name: {
    type: String,
    required: true
  },
  cloudinary_image_id: {
    type: String,
  },
  locality: {
    type: String,
  },
  area_name: {
    type: String,
  },
  cost_for_two: {
    type: Number,
  },
  avg_rating: {
    type: Number,
  },
  parent_id: {
    type: Number,
  },
  total_ratings: {
    type: String,
  },
  is_open: {
    type: Boolean,
  },
  type: {
    type: String,
  },
  next_close_time: {
    type: String,
  },
  display_type: {
    type: String,
  },
  cuisines: {
    type: [String],
    default: [],
  }
}, { timestamps: true });

// Create model
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;