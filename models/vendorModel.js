const mongoose = require("mongoose");

//***Given below function is checked by Er. Jitendra Nath
const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["purchase", "payment"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  purchaseBillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase",
  },
});

//***Given below function is checked by Er. Jitendra Nath
const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vendor name is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      set: (v) => v.replace(/[^0-9]/g, ""),
    },
    address: {
      type: String,
      trim: true,
    },
    pendingBalance: {
      type: Number,
      default: 0,
      description: "The Amount owner still needs to pay to vendor",
    },
    transactions: [transactionSchema],
    suppliedProducts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        lasPurchasePrice: {
          type: Number,
          required: true,
        },
        lastPurchaseDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//###--- Given below code is not checked yet by Er. Jitendra Nath
// Methods
vendorSchema.methods.updatePendingBalance = async function (
  amount,
  isPaid = false
) {
  if (isPaid) {
    // If payment is made in full, don't update pending balance
    return this.pendingBalance;
  }
  this.pendingBalance += amount;
  await this.save();
  return this.pendingBalance;
};

vendorSchema.methods.addTransaction = async function (transactionData) {
  this.transactions.push(transactionData);
  const isPaid =
    transactionData.type === "purchase" && transactionData.amount === 0;
  if (transactionData.type === "purchase") {
    await this.updatePendingBalance(transactionData.amount, isPaid);
  } else if (transactionData.type === "payment") {
    await this.updatePendingBalance(-transactionData.amount);
  }
  return this.save();
};

// Statics
vendorSchema.statics.findByPhone = function (phone) {
  return this.findOne({ phone });
};

// I think a method required to add products to suppliedProducts array of vendor

module.exports = mongoose.model("Vendor", vendorSchema);
