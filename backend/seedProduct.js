const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const Product = require("./models/Product");

const aquaXL = {
  name: "AQUA XL UNIT",
  category: "purifier",
  brand: "ASTRA",
  price: 0, // Contact for price
  stock: 10,
  description: "Materials Used: \n1. Cruze 100GPD pump \n2. Bolt SMBS adaptor \n3. SLC SV \n4. Aqua Inline \n5. HJC 80GPD Membrane \n6. SHI TONG Fittings \n7. C.C.K. Tube Roll \n8. G1 Filter (Optional)\n\nWe Used Top Brand Products and give products with Zero complaint for past Five years. Contact us for Attractive Price.\n\nProcess + Power + Satisfaction = ASTRA. GROW WITH ASTRA.",
  image: "uploads/aqua_xl.png"
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Check if it already exists
    const existing = await Product.findOne({ name: "AQUA XL UNIT" });
    if (existing) {
      console.log("Product AQUA XL UNIT already exists. Updating...");
      await Product.findByIdAndUpdate(existing._id, aquaXL);
    } else {
      const product = new Product(aquaXL);
      await product.save();
      console.log("Successfully added AQUA XL UNIT!");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding product:", error);
    process.exit(1);
  }
};

seed();
