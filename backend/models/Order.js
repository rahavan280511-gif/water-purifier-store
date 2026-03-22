const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    customerName: String,
    phone: String,
    address: String,
    productName: String,
    quantity: Number,
    status: {
        type: String,
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", OrderSchema);