const mongoose = require("mongoose");

// Define schema for restaurant availability
const restaurantAvailabilitySchema = new mongoose.Schema({
  av_id: {
    type: Number,
    required: true
  },
  restaurant_id: {
    type: Number,
    required: true
  },
  next_close_time: String,
  opened: Boolean
});

// Create model
const RestaurantAvailability = mongoose.model("RestaurantAvailability", restaurantAvailabilitySchema);

module.exports = RestaurantAvailability;
