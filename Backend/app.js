const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Log incoming requests
app.use((req, res, next) => {
 console.log(`Incoming ${req.method} request to ${req.path} from ${req.headers.origin}`);
next();
});
// Add to backend app.js before routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use(bodyParser.json());

// Routes
app.use('/api/products', productRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
