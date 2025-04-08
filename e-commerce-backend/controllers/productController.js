import Product from "./../models/productModel.js";
import fs from "fs";
import path from "path";

const addProduct = async (req, res) => {
  try {
    let { name, price, description, category, image, stock } = req.body;

    if (req.file) {
      image = req.file.path.replace(/\\/g, "/");
    }

    let newProduct = new Product({
      name,
      price,
      description,
      category,
      productImage: image,
      stock,
    });
    await newProduct.save();
    res.send(newProduct);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
const searchProductByTitle = async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  try {
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    });
    if (products.length == 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(products);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
// Original
// const updateProductDetails = async (req, res) => {
//   try {
//     console.log("Incoming update request:", req.body);
//     const products = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!products) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     if (req.file) {
//       const product = await Product.findById(req.params.id);
//       if (product.productImage) {
//         fs.unlinkSync(product.productImage);
//       }
//       products.productImage = req.file.path;
//       await products.save();
//     }
//     res.status(202).json(products);
//   } catch (e) {
//     res.status(400).json({ message: e.message });
//   }
// };

// Updated
const updateProductDetails = async (req, res) => {
  console.log("Incoming update request:", req.body);
  console.log("Incoming file:", req.file);

  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    // Validate required fields
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product fields
    product.name = name;
    product.description = description;
    product.price = Number(price);
    product.stock = Number(stock);
    product.category = category;

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (product.productImage) {
        const oldImagePath = path.join(process.cwd(), product.productImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.productImage = `/uploads/${req.file.filename}`;
    }

    // Validate the updated product
    try {
      await product.validate();
    } catch (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    await product.save();
    console.log("Updated product:", product);
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const removeProduct = async (req, res) => {
  try {
    const products = await Product.deleteMany();
    res.status(202).json(products);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
const removeProductById = async (req, res) => {
  try {
    const products = await Product.findByIdAndDelete(req.params.id);
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (req.file) {
      const product = await Product.findById(req.params.id);
      if (product.productImage) {
        fs.unlinkSync(product.productImage);
      }
      await products.save();
    }
    res.status(202).json(products);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
const fetchProducts = async (req, res) => {
  try {
    const product = await Product.find().populate("category");
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const fetchProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  const category = req.params.id;
  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }
  try {
    const products = await Product.find({ category });
    if (products.length == 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(products);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  searchProductByTitle,
  getProductsByCategory,
  removeProductById,
};
