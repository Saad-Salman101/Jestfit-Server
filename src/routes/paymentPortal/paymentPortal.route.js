const express = require("express");
const { paymentPortalController } = require("../../controllers");
const upload = require("../../middlewares/multer");
const router = express.Router();
const validate = require("../../middlewares/validate");
const { handleUpload } = require("../../middlewares/multers3");

router
  .route("/")
  .get(paymentPortalController.queryPaymentPortal)
  .post(handleUpload(true), paymentPortalController.createPaymentPortal);

router
  .route("/:id")
  .get(paymentPortalController.getPaymentPortal)
  .delete(paymentPortalController.deletePaymentPortal)
  .put(paymentPortalController.updatePaymentPortal);

module.exports = router;
