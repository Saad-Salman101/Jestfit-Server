const express = require("express");
const userRoute = require("./user/user.route");
const productRoute = require("./product/product.route");
const vendorRoute = require("./vendor/vendor.route");
const authRoute = require("./auth/auth.route");
const locationRoute = require("./Location/location.route");
const vendorPackageRoute = require("./vendorPackage/vendorPackage.route");
const sportType = require("./sportType/sportType.route");
const fieldRoute = require("./field/field.route");
const bookingRoute = require("./booking/booking.route");
const paymentDetailRoute = require("./paymentPortal/paymentPortal.route");
const orderRoute = require("./order/order.route");
const slotDisabler = require("./slotDisabler/slotDisabler.route");
const router = express.Router();

router.use("/user", userRoute);
router.use("/vendor", vendorRoute);
router.use("/location", locationRoute);
router.use("/auth", authRoute);
router.use("/vendorPackage", vendorPackageRoute);
router.use("/sportType", sportType);
router.use("/field", fieldRoute);
router.use("/booking", bookingRoute);
router.use("/paymentDetail", paymentDetailRoute);
router.use("/order", orderRoute);
router.use("/slotDisabler", slotDisabler);

module.exports = router;
