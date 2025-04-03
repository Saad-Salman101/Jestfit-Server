const express = require("express");
const { bookingController } = require("../../controllers");
const upload = require("../../middlewares/multer");
const router = express.Router();
// const bookingValidation = require("../../validations/booking.valdiation")
const validate = require("../../middlewares/validate");
const { verify } = require("../../middlewares/auth");

// In order to create booking we must create an order then boookings
router.route("/").get(bookingController.queryBooking);
// .post(bookingController.createBooking);

router.route("/verifyCart").post(bookingController.verifyCartAndCreateBooking);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .delete(bookingController.deleteBooking)
  .put(bookingController.updateBooking);

router.route("/dashboard/:id").get(bookingController.getDashboardData);

module.exports = router;
