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
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sale",
  },
});

//***Given below function is checked by Er. Jitendra Nath
const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      //###--- apply a phone number validator here
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    pendingBalance: {
      type: Number,
      default: 0,
      description: "The Amount customer still needs to pay",
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    transactions: [transactionSchema],
  },
  {
    timestamps: true,
  }
);

//###---Given below code is not checked yet by Er. Jitendra Nath
// Methods
customerSchema.methods.updatePendingBalance = async function (
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

customerSchema.methods.addTransaction = async function (transactionData) {
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
customerSchema.statics.findByPhone = function (phone) {
  return this.findOne({ phone });
};

module.exports = mongoose.model("Customer", customerSchema);
