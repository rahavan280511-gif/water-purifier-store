const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,   // purifier / spare part
  brand: String,
  stock: Number,
  description: String,
  image: String
});

module.exports = mongoose.model("Product", ProductSchema);