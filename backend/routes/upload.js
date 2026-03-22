const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const { auth, admin } = require("../middleware/auth");

const router = express.Router();

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the uploads directory exists
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Unified upload route to handle both images (for products) and PDFs
router.post("/upload", admin, upload.fields([{ name: "image", maxCount: 1 }, { name: "pdf", maxCount: 1 }]), async (req, res) => {
    console.log("POST /upload received. Files:", req.files ? Object.keys(req.files) : "none");
    try {
        if (!req.files) {
            return res.status(400).json({ error: "Upload failed: No file data received. Check field names and form-data." });
        }

        // Handle Image Upload
        if (req.files.image && req.files.image.length > 0) {
            const file = req.files.image[0];
            return res.json({
                message: "Image uploaded successfully",
                imageUrl: `uploads/${file.filename}`
            });
        }

        // Handle PDF Upload (with parsing for backward compatibility if needed)
        if (req.files.pdf && req.files.pdf.length > 0) {
            const file = req.files.pdf[0];
            const dataBuffer = fs.readFileSync(file.path);
            const data = await pdfParse(dataBuffer);

            return res.json({
                message: "PDF processed successfully",
                text: data.text,
                imageUrl: `uploads/${file.filename}`
            });
        }

        return res.status(400).json({ error: "No file uploaded. Please select a file with field name 'image' or 'pdf'." });

    } catch (error) {
        console.error("Upload Route Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;