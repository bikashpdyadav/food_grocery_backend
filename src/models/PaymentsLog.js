const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        trim: true,
    },
    transaction_id: {
        type: String,
        required: true,
        trim: true,
    },
    user_name: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: [
            "order_placed",
            "accepted",
            "ready_for_pickup",
            "out_for_delivery",
            "delivered",
            "completed",
            "canceled_by_customer",
            "canceled_by_restaurant",
            "delayed",
            "refund_initiated",
            "refund_completed"
        ],
        default: "order_placed",
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    type: {
        type: String,
        required: true,
    },
}, { timestamps: true })

const PaymentsLog = mongoose.model("PaymentsLog", paymentSchema);

module.exports = PaymentsLog;