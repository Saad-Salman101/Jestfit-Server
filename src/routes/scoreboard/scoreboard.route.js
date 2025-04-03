const express = require("express");
const productController = require("../../controllers/product.controller");

const router = express.Router();

router
  .route("/")
  .get(productController.getProducts)
  .post(upload.single("image"), productController.createProduct);

router
  .route("/:id")
  .delete(productController.deleteProduct)
  .patch(productController.updateProduct)
  .get(productController.getProduct);

module.exports = router;
