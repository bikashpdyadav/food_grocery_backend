const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: String,
        required: true,
    },
    user_location: {
        type: String,
        required: true
    },
    driver_location: {
        type: String,
    }
}, { timestamp: true });

const Location = mongoose.model("Location", LocationSchema);
module.exports = Location;
