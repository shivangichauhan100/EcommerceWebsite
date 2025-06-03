const Product = require('../models/Product');

e// controllers/productController.js
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      data: products // Ensure this matches what your frontend expects
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};