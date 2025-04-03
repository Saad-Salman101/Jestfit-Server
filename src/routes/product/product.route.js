const express = require("express");
const productController = require("../../controllers/product.controller");
const upload = require("../../middlewares/multer");
const validate = require("../../middlewares/validate");
const productValidation = require("../../validations/product.validation");

const router = express.Router();

router
  .route("/")
  .get(validate(productValidation.getProducts), productController.getProducts)
  .post(
    upload.array("images", 5),
    validate(productValidation.createProduct),
    productController.createProduct
  );

router
  .route("/:id")
  .delete(validate(productValidation.getProduct), productController.deleteProduct)
  .patch(validate(productValidation.updateProduct), productController.updateProduct)
  .get(validate(productValidation.getProduct), productController.getProduct);

module.exports = router;
