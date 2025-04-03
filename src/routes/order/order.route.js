const express = require("express");
const { orderController } = require("../../controllers");
const upload = require("../../middlewares/multer");
const orderValidation = require("../../validations/order.validation");
const validate = require("../../middlewares/validate");
const { verify } = require("../../middlewares/auth");
const { handleUpload } = require("../../middlewares/multers3");
const router = express.Router();

router
  .route("/")
  .get(verify(), validate(orderValidation.queryOrder), orderController.queryOrders)
  .post(
    verify(),
    //  handleUpload,
    orderController.createOrder
  );

router
  .route("/fast")
  .post(verify(), orderController.createFastOrder)
  .put(verify(["vendor", "admin"]), orderController.confirmPaymentForFastBooking);

router.route("/confirmPayment").post(verify(), handleUpload(), orderController.confirmPayment);

router
  .route("/:id")
  .get(verify(), orderController.getOrderById)
  .delete(verify(["vendor", "admin"]), orderController.deleteOrder)
  .put(
    verify(["vendor", "admin"]),
    validate(orderValidation.updateOrder),
    orderController.updateOrder
  );

module.exports = router;
