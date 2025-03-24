const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

router
  .route("/")
  .get(purchaseController.getAllPurchases)
  .post(purchaseController.createPurchase)
  .delete(purchaseController.deleteAllPurchases);

router
  .route("/:id")
  .get(purchaseController.getPurchase)
  .patch(purchaseController.updatePurchase)
  .delete(purchaseController.deletePurchase);

//###---Given below code is not checked yet by Er. Jitendra Nath
router.post("/:id/payments", purchaseController.addPayment);

module.exports = router;
