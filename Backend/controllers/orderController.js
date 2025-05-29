const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderConfirmationEmail } = require('../services/emailService');
const { processPayment } = require('../services/paymentService');

// create new order
exports.createOrder = async (req, res) => {
  try {
    const { product, customer, payment } = req.body;
    // Validate product inventory
    const dbProduct = await Product.findById(product.id);
    if (!dbProduct || dbProduct.inventory < product.quantity) {
      return res.status(400).json({ error: 'Product not available in requested quantity' });
    }
    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;
    // Process payment
    const paymentResult = await processPayment(payment, product.price * product.quantity);
    // Create order
    const order = new Order({
      orderNumber,
      product: {
        id: product.id,
        name: product.title,
        variant: product.selectedVariant,
        quantity: product.quantity,
        price: product.price
      },
      customer,
      payment: {
        cardLastFour: payment.cardNumber.slice(-4),
        amount: product.price * product.quantity,
        status: paymentResult.status
      },
      status: paymentResult.status === 'approved' ? 'processing' : 'cancelled',
      total: product.price * product.quantity
    });
    
    // If payment approved, update inventory
    if (paymentResult.status === 'approved') {
      await Product.findByIdAndUpdate(product.id, {
        $inc: { inventory: -product.quantity }
      });
    }
    
    // Save order
    await order.save();
    
    // Send email notification
    await sendOrderConfirmationEmail(order, customer.email);
    
    res.status(201).json({
      orderNumber: order.orderNumber,
      status: order.payment.status,
      message: paymentResult.message
    });
    
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Get order details
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};