const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router
  .route("/")
  .get(customerController.getAllCustomers)
  .post(customerController.createCustomer)
  .delete(customerController.deleteAllCustomers);

router
  .route("/:id")
  .get(customerController.getCustomer)
  .patch(customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

//###---Given below code is not checked yet by Er. Jitendra Nath
router.get("/:id/transactions", customerController.getCustomerTransactions);
router.post("/:id/payments", customerController.addCustomerPayment);

module.exports = router;
