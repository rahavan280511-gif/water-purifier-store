const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Product = require("../models/Product");
const { auth, admin } = require("../middleware/auth");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD PRODUCT
router.post("/", admin, async (req, res) => {
  console.log("POST /api/products received:", req.body);
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    console.error("POST /api/products Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET distinct brands
router.get("/brands", async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter products
router.get("/filter", async (req, res) => {

  const { category, brand } = req.query;

  const filter = {};

  if (category) filter.category = category;
  if (brand) filter.brand = brand;

  const products = await Product.find(filter);

  res.json(products);
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/:id", admin, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
    console.log(`Updating product ${id} with data:`, req.body);
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error("Product Update Error Detail:", {
        message: error.message,
        stack: error.stack,
        body: req.body,
        id: id
    });
    res.status(500).json({ error: "Database error", message: error.message });
  }
});
router.delete("/:id", admin, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;