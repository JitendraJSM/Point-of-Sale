const Customer = require("../models/customerModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");

// Get all customers //***Given below function is checked by Er. Jitendra Nath
exports.getAllCustomers = catchAsync(async (req, res) => {
  const features = new APIFeatures(Customer.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const customers = await features.query;

  res.status(200).json({
    status: "success",
    results: customers.length,
    data: customers,
  });
});

// Get single customer //***Given below function is checked by Er. Jitendra Nath
exports.getCustomer = catchAsync(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: customer,
  });
});

// Create new customer //***Given below function is checked by Er. Jitendra Nath
exports.createCustomer = catchAsync(async (req, res) => {
  const customer = await Customer.create(req.body); //###--- Needs Data Sanitization here
  if (!customer) {
    throw new AppError("Customer not created", 400);
  }
  res.status(201).json({
    status: "success",
    data: customer,
  });
});

// Update customer //***Given below function is checked by Er. Jitendra Nath
exports.updateCustomer = catchAsync(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    req.body, //###--- Needs Data Sanitization here
    {
      new: true,
      runValidators: true,
    }
  );
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: customer,
  });
});

// Delete customer //***Given below function is checked by Er. Jitendra Nath
exports.deleteCustomer = catchAsync(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }
  if (process.env.NODE_ENV === "development") {
    return res.status(200).json({
      status: "success",
      dataDeleted: customer,
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Delete all customers //***Given below function is checked by Er. Jitendra Nath
exports.deleteAllCustomers = catchAsync(async (req, res) => {
  const result = await Customer.deleteMany({});
  if (process.env.NODE_ENV === "development") {
    return res.status(200).json({
      status: "success",
      deletedCount: result.deletedCount,
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

//###---Given below code is not checked yet by Er. Jitendra Nath
// Get customer transactions
exports.getCustomerTransactions = catchAsync(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: customer.transactions,
  });
});

// Add customer payment
exports.addCustomerPayment = catchAsync(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  customer.transactions.push({
    type: "payment",
    amount: req.body.amount,
    date: req.body.date || Date.now(),
  });

  customer.balance -= req.body.amount;
  await customer.save();

  res.status(200).json({
    status: "success",
    data: customer,
  });
});
