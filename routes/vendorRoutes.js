const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");

router
  .route("/")
  .get(vendorController.getAllVendors)
  .post(vendorController.createVendor)
  .delete(vendorController.deleteAllVendors);

router
  .route("/:id")
  .get(vendorController.getVendor)
  .patch(vendorController.updateVendor)
  .delete(vendorController.deleteVendor);

//###---Given below code is not checked yet by Er. Jitendra Nath
router.get("/:id/transactions", vendorController.getVendorTransactions);
router.post("/:id/payments", vendorController.addVendorPayment);

module.exports = router;
