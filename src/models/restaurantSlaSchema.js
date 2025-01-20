const mongoose = require("mongoose");

// Define schema for restaurant SLA
const restaurantSlaSchema = new mongoose.Schema({
  sla_id: {
    type: Number,
    required: true
  },
  rt_id: {
    type: Number,
    required: true
  },
  delivery_time: Number,
  last_mile_travel: Number,
  serviceability: String,
  sla_string: String,
  icon_type: String
});

// Create model
const RestaurantSla = mongoose.model("RestaurantSla", restaurantSlaSchema);

module.exports = RestaurantSla;
