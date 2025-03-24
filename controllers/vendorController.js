const Vendor = require("../models/vendorModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");

// Get all vendors   //***Given below function is checked by Er. Jitendra Nath
exports.getAllVendors = catchAsync(async (req, res) => {
  const features = new APIFeatures(Vendor.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const vendors = await features.query;

  res.status(200).json({
    status: "success",
    results: vendors.length,
    data: vendors,
  });
});

// Get single vendor //***Given below function is checked by Er. Jitendra Nath
exports.getVendor = catchAsync(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    throw new AppError("Vendor not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: vendor,
  });
});

// Create new vendor   //***Given below function is checked by Er. Jitendra Nath
exports.createVendor = catchAsync(async (req, res) => {
  const vendor = await Vendor.create(req.body); //###--- Needs Data Sanitization here
  res.status(201).json({
    status: "success",
    data: vendor,
  });
});

// Update vendor   //***Given below function is checked by Er. Jitendra Nath
exports.updateVendor = catchAsync(async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    req.body, //###--- Needs Data Sanitization here
    {
      new: true,
      runValidators: true,
    }
  );
  if (!vendor) {
    throw new AppError("Vendor not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: vendor,
  });
});

// Delete vendor   //***Given below function is checked by Er. Jitendra Nath
exports.deleteVendor = catchAsync(async (req, res) => {
  const vendor = await Vendor.findByIdAndDelete(req.params.id);
  if (!vendor) {
    throw new AppError("Vendor not found", 404);
  }

  if (process.env.NODE_ENV === "development") {
    return res.status(200).json({
      status: "success",
      dataDeleted: vendor,
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Delete all vendors  //***Given below function is checked by Er. Jitendra Nath
exports.deleteAllVendors = catchAsync(async (req, res) => {
  const result = await Vendor.deleteMany({});
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
// Get vendor transactions
exports.getVendorTransactions = catchAsync(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    throw new AppError("Vendor not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: vendor.transactions,
  });
});

// Add vendor payment
exports.addVendorPayment = catchAsync(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    throw new AppError("Vendor not found", 404);
  }

  vendor.transactions.push({
    type: "payment",
    amount: req.body.amount,
    date: req.body.date || Date.now(),
  });

  vendor.balance -= req.body.amount;
  await vendor.save();

  res.status(200).json({
    status: "success",
    data: vendor,
  });
});

// I think a controller required to add products to suppliedProducts array of vendor
