// const express = require('express');
// const router = express.Router();
// const ProductsModel = require('../models/products');

// // Get all products
// router.get('/', async (req, res) => {
//   try {
//     const products = await ProductsModel.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch products", error: error.message });
//   }
// });

// // Get single product by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const product = await ProductsModel.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch product", error: error.message });
//   }
// });

// // Create new product
// router.post('/', async (req, res) => {
//   try {
//     const newProduct = new ProductsModel(req.body);
//     await newProduct.save();
//     res.status(201).json({ message: "Product created", product: newProduct });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create product", error: error.message });
//   }
// });

// // Update product by ID
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedProduct = await ProductsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
//     res.json({ message: "Product updated", product: updatedProduct });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update product", error: error.message });
//   }
// });

// // Delete product by ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedProduct = await ProductsModel.findByIdAndDelete(req.params.id);
//     if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
//     res.json({ message: "Product deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete product", error: error.message });
//   }
// });

// module.exports = router;
