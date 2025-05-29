const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const app = express();
// Middleware
app.use(bodyParser.json());
app.use(cors());
// Routes
app.use("/api/orders", orderRoutes);
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
module.exports = app;
