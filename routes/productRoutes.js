const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct)
  .delete(productController.deleteAllProducts);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

//###---Given below code is not checked yet by Er. Jitendra Nath
router.get("/:id/stock-movement", productController.getStockMovement);
router.patch("/:id/stock", productController.updateStock);

module.exports = router;
