const mongoose = require("mongoose");

const ServiceRequestSchema = new mongoose.Schema({
    customerName: String,
    phone: String,
    address: String,
    serviceType: String,
    issueDescription: String,
    status: {
        type: String,
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
