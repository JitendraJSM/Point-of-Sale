const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  lastPurchasePrice: {
    type: Number,
    required: true,
  },
  lastPurchaseDate: {
    type: Date,
    default: Date.now,
  },
});

const stockMovementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["in", "out"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  billNumber: {
    type: String,
    required: true, // Remove required: true and add this using pre-save middleware
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true, // Remove required: true and add this using pre-save middleware
  },
  vendorName: {
    type: String,
    required: true, // Remove required: true and add this using pre-save middleware
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase",
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "N/A",
      trim: true,
    },
    category: {
      type: String,
      default: "N/A",
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
    },
    unitPurchasePrice: {
      type: Number,
      required: [true, "Purchase price is required"],
    },
    unitSellingPrice: {
      type: Number,
      default: 0,
    },
    stock: {
      current: {
        type: Number,
        default: 0,
      },
      minimum: {
        type: Number,
        default: 0,
      },
      maximum: {
        type: Number,
        default: 0,
      },
    },
    unit: {
      type: String,
      default: "pcs",
      trim: true,
    },
    vendors: [vendorSchema],
    stockMovement: [stockMovementSchema],
  },
  {
    timestamps: true,
  }
);

//###---Given below code is not checked yet by Er. Jitendra Nath
// Pre-save middleware for SKU generation
productSchema.pre("save", async function (next) {
  if (!this.sku) {
    const prefix = this.category.substring(0, 3).toUpperCase();
    const namePrefix = this.name.substring(0, 3).toUpperCase();
    const count = await this.constructor.countDocuments({
      category: this.category,
    });
    this.sku = `${prefix}${namePrefix}${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Pre-save middleware
productSchema.pre("save", async function (next) {
  if (!this.sku) {
    this.sku = await this.constructor.generateSKU(this.category, this.name);
  }
  next();
});

// Methods
productSchema.methods.updateStock = async function (quantity, type, reference) {
  const movement = {
    type,
    quantity: Math.abs(quantity),
    reference,
  };

  this.stockMovement.push(movement);
  this.stock.current += type === "in" ? quantity : -quantity;
  return this.save();
};

productSchema.methods.addVendor = async function (vendorData) {
  this.vendors.push(vendorData);
  return this.save();
};

// Statics
productSchema.statics.findBySku = function (sku) {
  return this.findOne({ sku });
};

productSchema.statics.findLowStock = function () {
  return this.find({
    "stock.current": { $lte: "$stock.minimum" },
  });
};

module.exports = mongoose.model("Product", productSchema);
