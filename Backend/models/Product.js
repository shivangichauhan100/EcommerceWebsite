const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  variants: {
    color: [String],
    size: [String]
  },
  inventory: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);