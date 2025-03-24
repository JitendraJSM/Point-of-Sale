const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/database");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const customerRoutes = require("./routes/customerRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const productRoutes = require("./routes/productRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
// const salesRoutes = require("./routes/saleRoutes");
// const financeRoutes = require("./routes/financeRoutes");

// API Routes
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/purchases", purchaseRoutes);
// app.use("/api/v1/sales", salesRoutes);
// app.use("/api/v1/finance", financeRoutes);

// Handling unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware (should be after all routes)
const errorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `Server is running on port http://localhost:${port}/api/v1 in ${process.env.NODE_ENV} mode`
  );
});

module.exports = app;
