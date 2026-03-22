const express = require("express");
const router = express.Router();
const ServiceRequest = require("../models/ServiceRequest");
const { auth, admin } = require("../middleware/auth");

router.post("/", async (req, res) => {
    try {
        const request = new ServiceRequest(req.body);
        const savedRequest = await request.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/", admin, async (req, res) => {
    try {
        const requests = await ServiceRequest.find();
        res.json(requests);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;