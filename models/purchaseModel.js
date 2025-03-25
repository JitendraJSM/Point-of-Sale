const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, "Quantity cannot be negative"],
  },
  unitPurchasePrice: {
    type: Number,
    required: true,
    min: [0, "Unit price cannot be negative"],
  },
  totalAmountItemWise: {
    type: Number,
    required: true,
  },
  taxCategory: {
    type: String,
    enum: ["GST", "IGST", "UTGST", "No Tax", "N/A"],
  },
  taxRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
});

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: [0, "Payment amount cannot be negative"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  method: {
    type: String,
    required: true,
    enum: ["cash", "card", "bank_transfer", "cheque"],
  },
});

const purchaseSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    vendorPhone: {
      type: Number,
      required: true,
      set: (v) => v.replace(/[^0-9]/g, ""),
    },
    billDate: {
      type: Date,
      required: true,
    },
    inventoryDate: {
      type: Date,
      default: Date.now,
    },
    items: [purchaseItemSchema],
    totalAmountWithTax: {
      type: Number,
      required: true,
      min: [50, "Total amount cannot be less than 50"],
    },
    totalTaxAmount: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid"],
      default: "unpaid",
    },
    payments: [paymentSchema],
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate totals
purchaseSchema.pre("save", function (next) {
  if (this.isModified("items")) {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);
    this.totalTaxAmount = this.items.reduce(
      (sum, item) => sum + item.taxAmount,
      0
    );
  }
  next();
});

//###---Given below code is not checked yet by Er. Jitendra Nath
// Method to add payment
purchaseSchema.methods.addPayment = async function (paymentData) {
  this.payments.push(paymentData);
  const totalPaid = this.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  if (totalPaid >= this.totalAmount) {
    this.paymentStatus = "paid";
  } else if (totalPaid > 0) {
    this.paymentStatus = "partial";
  }

  await this.save();
  return this;
};

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
