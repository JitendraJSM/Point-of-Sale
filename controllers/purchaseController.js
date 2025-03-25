const mongoose = require("mongoose");
const Purchase = require("../models/purchaseModel");
const Product = require("../models/productModel");
const Vendor = require("../models/vendorModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// Get all purchases
exports.getAllPurchases = catchAsync(async (req, res) => {
  const purchases = await Purchase.find()
    .populate("vendor")
    .populate("items.product");
  res.status(200).json({
    status: "success",
    data: purchases,
  });
});

// Get single purchase
exports.getPurchase = catchAsync(async (req, res) => {
  const purchase = await Purchase.findById(req.params.id)
    .populate("vendor")
    .populate("items.product");
  if (!purchase) {
    throw new AppError("Purchase not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: purchase,
  });
});

// Create new purchase
exports.createPurchase = catchAsync(async (req, res) => {
  // 0. Check for fields required but not provided in req.body as they are required to create a purchase
  ["billNumber", "vendorName", "vendorPhone", "billDate", "items"].forEach(
    (field) => {
      if (!req.body[field]) {
        throw new AppError(`Missing required field: ${field}`, 400);
      }
    }
  );
  if (!(Array.isArray(req.body.items) && req.body.items.length !== 0)) {
    throw new AppError(
      "Items must be an array having atleast on product.",
      400
    );
  }

  // 1. Process purchase data
  const purchaseData = {};
  purchaseData.billNumber = req.body.billNumber;
  purchaseData.vendorName = req.body.vendorName.trim().toLowerCase();
  purchaseData.vendorPhone = req.body.vendorPhone.replace(/[\s-]/g, "");
  purchaseData.billDate = req.body.billDate;
  purchaseData.inventoryDate = req.body.inventoryDate;
  purchaseData.itemsData = req.body.items;
  purchaseData.totalAmountWithTax = req.body.totalAmountWithTax;
  purchaseData.totalTaxAmount = req.body.totalTaxAmount;
  purchaseData.taxBreakdown = req.body.taxBreakdown;
  purchaseData.paymentStatus = req.body.paymentStatus;
  purchaseData.payments = req.body.payments;
  purchaseData.notes = req.body.notes;

  // 2. Check if vendor exists or create new one
  let vendor;
  // 2.1 Try to find vendor by name or phone with case-insensitive matching
  vendor = await Vendor.findOne({
    $or: [
      { name: purchaseData.vendorName },
      { phone: purchaseData.vendorPhone }, // Remove spaces and hyphens from phone
    ],
  });
  vendor && console.log(`Vendor found: ${vendor.name}`);

  // 2.2 If vendor not found, create new one
  if (!vendor) {
    vendor = await Vendor.create({
      name: purchaseData.vendorName,
      phone: purchaseData.vendorPhone,
    });
    console.log(`Vendor created: ${vendor.name}`);
  }

  purchaseData.vendor = vendor._id;

  // 3. Process items Array, For that Find products and if needed then create products
  const processedItems = [];
  for (const itemData of purchaseData.itemsData) {
    let product;
    // 2.1 Try to find product by name or create new one
    const searchQuery = itemData.productName.trim().toLowerCase();
    product = await Product.findOne({ name: searchQuery });
    product && console.log(`Product found: ${product.name}`);

    // 2.2 If product not found, create new one
    if (!product) {
      const productData = {
        name: itemData.productName,
        unitPurchasePrice: (
          (itemData.totalAmountItemWise * 1) /
          (itemData.quantity * 1)
        ).toFixed(2),
        unitSellingPrice: itemData.unitSellingPrice || 0,
        category: itemData.category || "N/A",
        description: itemData.description || "N/A",
        unit: itemData.unit || "N/A",
        sku: itemData.sku || "N/A",
      };
      product = await Product.create(productData);
      console.log(`Product created: ${product}`);
    }

    // 2.3 Add processed item to array
    processedItems.push({
      product: product._id,
      name: product.name,
      quantity: itemData.quantity,
      unitPurchasePrice: itemData.unitPurchasePrice,
      totalAmountItemWise: itemData.totalAmountItemWise,
      taxCategory: itemData.taxCategory || "N/A",
      taxRate: itemData.taxRate || 0,
      taxAmount:
        (itemData.quantity *
          itemData.unitPurchasePrice *
          (itemData.taxRate || 0)) /
        100,
    });
  }

  //***Code given above of this function is checked by Er. Jitendra Nath
  //***Code given below of this function is checked by Er. Jitendra Nath
  // 3. Create purchase with processed items
  try {
    // 3.1 Create purchase
    const purchase = await Purchase.create({
      billNumber: purchaseData.billNumber,
      vendor: vendor._id,
      vendorName: vendor.vendorName,
      billDate: purchaseData.billDate,
      inventoryDate: purchaseData.inventoryDate,
      items: processedItems,
      totalAmount: processedItems.reduce(
        (sum, item) => sum + item.totalAmountItemWise,
        0
      ),
      totalTaxAmount: processedItems.reduce(
        (sum, item) => sum + item.taxAmount,
        0
      ),
      paymentStatus: purchaseData.paymentStatus,
      payments: purchaseData.payments,
      notes: purchaseData.notes,
    });
    console.log(`Purchase created: ${purchase._id}`);

    // 3.3 Update products stock and vendor info
    for (const item of processedItems) {
      try {
        // 3.3.1 Find product
        const product = await Product.findById(item.product._id);

        // 3.3.2 Update stock
        product.stock.current += item.quantity;
        product.stockMovement.push({
          type: "in",
          quantity: item.quantity,
          unitPurchasePrice: item.unitPurchasePrice,
          date: purchase.purchaseDate,
          billNumber: purchase.billNumber,
          billDate: purchase.billDate,
          vendor: vendor._id,
          vendorName: vendor.name,
          vendorPhone: vendor.phone,
          reference: purchase._id,
        });

        // 3.3.3 Update vendor info
        const vendorIndex = product.vendors.findIndex(
          (v) => v.vendor.toString() === vendor._id.toString()
        );
        if (vendorIndex >= 0) {
          product.vendors[vendorIndex].vendorName = vendor.name;
          product.vendors[vendorIndex].lastPurchasePrice =
            item.unitPurchasePrice;
          product.vendors[vendorIndex].lastPurchaseDate = purchase.purchaseDate;
        } else {
          product.vendors.push({
            vendor: vendor._id,
            vendorName: vendor.name,
            lastPurchasePrice: item.unitPurchasePrice,
            lastPurchaseDate: purchase.purchaseDate,
          });
        }

        await product.save();
      } catch (error) {
        throw new Error(
          `Error processing item ${item.product.name}: ${error.message}`
        );
      }
    }

    //###--- Till everything is checked so go add other fields using reference of purchase model.
    // 3.2 Update vendor balance and add transaction
    vendor.transactions.push({
      type: "purchase",
      amount: purchase.totalAmount,
      date: purchase.purchaseDate,
      purchaseBillId: purchase._id,
    });
    await vendor.save();

    res.status(201).json({
      status: "success",
      data: purchase,
    });
  } catch (error) {
    // If any error occurs during the process, we need to handle it appropriately
    // In a production environment, you might want to implement a rollback mechanism here
    // console.log(`-=-=-=-=-=-=-=-=-=-);
    // console.log(error);
    // console.log(`-=-=-=-=-=-=-=-=-=-);

    throw error;
  }
  // 4. Update vendor pendingBalance if paymentStatus is either "partial" or "paid" & add transaction
  // 5. Update products stock in inventory
});

// Update purchase
exports.updatePurchase = catchAsync(async (req, res) => {
  const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!purchase) {
    throw new AppError("Purchase not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: purchase,
  });
});

// Delete purchase
exports.deletePurchase = catchAsync(async (req, res) => {
  const purchase = await Purchase.findByIdAndDelete(req.params.id);
  if (!purchase) {
    throw new AppError("Purchase not found", 404);
  }
  if (process.env.NODE_ENV === "development") {
    return res.status(200).json({
      status: "success",
      dataDeleted: purchase,
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Delete all purchases
exports.deleteAllPurchases = catchAsync(async (req, res) => {
  const result = await Purchase.deleteMany({});
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
// Add payment to purchase
exports.addPayment = catchAsync(async (req, res) => {
  const purchase = await Purchase.findById(req.params.id);
  if (!purchase) {
    throw new AppError("Purchase not found", 404);
  }

  const vendor = await Vendor.findById(purchase.vendor);

  // Add payment to purchase
  await purchase.addPayment(req.body);

  // Update vendor balance and add transaction
  vendor.balance -= req.body.amount;
  vendor.transactions.push({
    type: "payment",
    amount: req.body.amount,
    date: req.body.date || Date.now(),
    purchaseBillId: purchase._id,
  });
  await vendor.save();

  res.status(200).json({
    status: "success",
    data: purchase,
  });
});
