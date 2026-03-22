const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const uploadRoutes = require("./routes/upload");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// SPA Handle Middleware (for React Router)
app.use((req, res, next) => {
    const isApi = req.path.startsWith('/api');
    const isUpload = req.path.startsWith('/uploads');
    const hasExtension = req.path.split('/').pop().includes('.');
    
    if (req.method === 'GET' && !isApi && !isUpload && !hasExtension) {
        return res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    }
    next();
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            "img-src": ["*", "'self'", "data:", "https://images.unsplash.com"],
        },
    },
    crossOriginResourcePolicy: false,
}));

// Rate Limiting (100 requests per 15 minutes)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(apiLimiter);


// middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);

// Secure config endpoint - exposes only non-sensitive public config
app.get("/api/config", (req, res) => {
    res.json({ whatsappNumber: process.env.WHATSAPP_NUMBER });
});

// Serve the frontend static files (from Vite's dist folder)
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
    });

// test route
app.get("/api/ping", (req, res) => {
    res.send("API Live");
});

// Debug specific route
app.get('/login', (req, res) => {
    console.log("LOGIN ROUTE HIT");
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// React Router Catch-all (for SPA)
// Using regex to satisfy Express 5's strict path-to-regexp requirements
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// server start
const PORT = process.env.PORT || 5000;

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);
    res.status(500).json({ 
        error: "Internal Server Error", 
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});