const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { auth, admin } = require("../middleware/auth");

// Create Order (Public)
router.post("/", async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.json(savedOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Orders (Admin Only)
router.get("/", admin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;