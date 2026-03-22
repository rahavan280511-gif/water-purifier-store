const express = require("express");
const jwt = require("jsonwebtoken");
const util = require("util");
const signJwt = util.promisify(jwt.sign);
const User = require("../models/User");
const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log("LOGIN ATTEMPT - Username:", username);
    try {
        let user = await User.findOne({ username });
        if (!user) {
            console.log("Login failed: User not found");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("User found in DB, comparing passwords...");
        const isMatch = await user.comparePassword(password);
        console.log("Password match result:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        console.log("Signing token with payload:", payload);
        const token = await signJwt(
            payload,
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "7d" }
        );

        console.log("Token signed successfully. Sending response...");
        res.json({ token, role: user.role });
    } catch (err) {
        console.error("LOGIN ROUTE ERROR:", err);
        res.status(500).json({ message: "Server error during login", error: err.message });
    }
});

// INITIAL ADMIN CREATION (Only use this once to set up the first admin)
router.post("/setup", async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: "Admin already exists" });

        user = new User({ username, password, role: "admin" });
        await user.save();
        res.json({ message: "Admin created successfully" });
    } catch (err) {
        console.error("Setup error:", err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
