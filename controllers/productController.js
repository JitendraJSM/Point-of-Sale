const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");

// Get all products //***Given below function is checked by Er. Jitendra Nath
exports.getAllProducts = catchAsync(async (req, res) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  res.status(200).json({
    status: "success",
    results: products.length,
    data: products,
  });
});

// Get single product
exports.getProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: product,
  });
});

// Create new product
exports.createProduct = catchAsync(async (req, res) => {
  const product = await Product.create(req.body); //###--- Needs Data Sanitization here
  res.status(201).json({
    status: "success",
    data: product,
  });
});

// Update product
exports.updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: product,
  });
});

// Delete product
exports.deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  if (process.env.NODE_ENV === "development") {
    return res.status(200).json({
      status: "success",
      dataDeleted: product,
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Delete all products
exports.deleteAllProducts = catchAsync(async (req, res) => {
  const result = await Product.deleteMany({});
  res.status(200).json({
    status: "success",
    data: {
      deletedCount: result.deletedCount,
    },
  });
});

//###---Given below code is not checked yet by Er. Jitendra Nath
// Get product stock movement
exports.getStockMovement = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: product.stockMovement,
  });
});

// Update product stock
exports.updateStock = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const { type, quantity, reference } = req.body;

  // Add stock movement record
  product.stockMovement.push({
    type,
    quantity,
    date: Date.now(),
    reference,
  });

  // Update current stock
  if (type === "in") {
    product.stock.current += quantity;
  } else if (type === "out") {
    if (product.stock.current < quantity) {
      return res.status(400).json({
        status: "error",
        message: "Insufficient stock",
      });
    }
    product.stock.current -= quantity;
  }

  await product.save();

  res.status(200).json({
    status: "success",
    data: product,
  });
});
