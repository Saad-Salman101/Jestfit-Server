const express = require("express");
const { vendorPackageController } = require("../../controllers");
const upload = require("../../middlewares/multer")
const router = express.Router();

router
    .route("/")
    .get(vendorPackageController.queryVendorPackage)
    .post(vendorPackageController.createVendorPackage);

router
    .route("/:id")
    .get(vendorPackageController.getVendorPackage)
    .delete(vendorPackageController.deleteVendorPackage)
    .put(vendorPackageController.updateVendorPackage);

module.exports = router;
