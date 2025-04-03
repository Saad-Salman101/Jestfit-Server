const express = require("express");
const vendorController = require("../../controllers/vendor.controller.js");
const { verify } = require("../../middlewares/auth.js");

const router = express.Router();

router
  .route("/")
  .get(verify(), vendorController.queryVendors)
  .post(vendorController.createVendor);

router
  .route("/:id")
  .get(vendorController.getVendor)
  .delete(vendorController.deleteVendor)
  .put(vendorController.updateVendor);

module.exports = router;
