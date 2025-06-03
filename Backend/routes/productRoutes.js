const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Input validation middleware
const validateProductInput = (req, res, next) => {
  const { title, description, price, image, inventory } = req.body;
  
  if (!title || !description || !price || !image || inventory === undefined) {
    return res.status(400).json({ 
      success: false,
      message: 'All fields are required' 
    });
  }
  
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ 
      success: false,
      message: 'Price must be a positive number' 
    });
  }
  
  if (typeof inventory !== 'number' || inventory < 0) {
    return res.status(400).json({ 
      success: false,
      message: 'Inventory must be a non-negative number' 
    });
  }
  
  next();
};

// Create a new product
router.post('/', validateProductInput, async (req, res) => {
  try {
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
      inventory: req.body.inventory,
      variants: {
        color: req.body.variants?.color || ['Black', 'White'],
        size: req.body.variants?.size || ['S', 'M', 'L']
      }
    });

    const savedProduct = await product.save();
    
    res.status(201).json({
      success: true,
      data: savedProduct
    });
    
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating product',
      error: error.message 
    });
  }
});

// Get all products with pagination and filtering
router.get('/', async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Basic filtering
    const filter = {};
    if (req.query.title) {
      filter.title = new RegExp(req.query.title, 'i');
    }
    if (req.query.minPrice) {
      filter.price = { $gte: parseFloat(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };
    }

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(filter);

    res.json({
      success: true,
      count: products.length,
      total: totalProducts,
      page,
      pages: Math.ceil(totalProducts / limit),
      data: products
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching products',
      error: error.message 
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid product ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching product',
      error: error.message 
    });
  }
});

// Update product
router.put('/:id', validateProductInput, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,
        runValidators: true 
      }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      data: updatedProduct
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid product ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating product',
      error: error.message 
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid product ID format' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting product',
      error: error.message 
    });
  }
});

module.exports = router;