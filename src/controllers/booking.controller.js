const httpStatus = require("http-status");
const { bookingService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { json } = require("express");
const { v4: uuidv4 } = require("uuid");

// const createBooking = catchAsync(async (req, res) => {
//   //for local storage
//   // if (!req.file) {
//   //   return res
//   //     .status(httpStatus.BAD_REQUEST)
//   //     .send({ message: "Image proof is required", success: false, result: null });
//   // }
//   req.body.cartData = await JSON.parse(req.body.cartData);
//   let id = uuidv4();
//   let expiryTime = new Date();
//   expiryTime = expiryTime.addMinutes(10);
//   const body = req.body.cartData.map((item, index) => {
//     delete item._id;
//     return {
//       ...item,
//       expiresAt: expiryTime,
//       bookingNumber: id,
//       amount: req.body.amount,
//       image: req.file.filename,
//     };
//   });
//   console.log(body, "<=== wow");
//   const result = await bookingService.createBooking(body);
//   res
//     .status(httpStatus.CREATED)
//     .send({ success: true, message: "Successfully created Booking", result });
// });

const queryBooking = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    "_id",
    "name",
    "block",
    "tags",
    "vendorID",
    "locationID",
    "fieldID",
    "bookingDate",
    "orderID",
    "date",
  ]);
  const options = pick(req.query, [, "sortBy", "limit", "page", "groupBy"]);
  const result = await bookingService.queryBooking(filters, options);
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "Successfully fetched results", result });
});

const deleteBooking = catchAsync(async (req, res) => {
  const result = await bookingService.deleteBookingById(req.params.id);
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "Successfully deleted", result: result });
});

const getBooking = catchAsync(async (req, res) => {
  const result = await bookingService.getBookingById(req.params.id);
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "successfully fetched Booking", result });
});

const updateBooking = catchAsync(async (req, res) => {
  const result = await bookingService.updateBookingById(req.params.id, req.body);
  res.status(httpStatus.OK).send({ success: true, message: "Successfully Updated", result });
});

// const createFastBooking = catchAsync(async (req, res) => {
//   if (!req.file) {
//     return res
//       .status(httpStatus.BAD_REQUEST)
//       .send({ message: "Image proof is required", success: false, result: null });
//   }
//   req.body.cartData = await JSON.parse(req.body.cartData);
//   let id = uuidv4();
//   const body = req.body.cartData.map((item, index) => {
//     delete item._id;
//     return {
//       ...item,
//       bookingNumber: id,
//       amount: req.body.amount,
//       image: req.file.filename,
//     };
//   });
//   const result = await bookingService.createBooking(body);
//   res.status(httpStatus.OK).send({ success: true, message: "Successfully Updated", result });
// });

const getDashboardData = catchAsync(async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({ message: "no vendor ID", result: null, success: false });
  }
  const statistics = await bookingService.getStatistics(req.params.id);
  const getBookings = await bookingService.getTodayBookingsGrouped(req.params.id);
  res.status(httpStatus.OK).send({
    success: true,
    message: "Successfully Updated",
    result: {
      statistics,
      getBookings,
    },
  });
});

const verifyCartAndCreateBooking = catchAsync(async (req, res) => {
  const result = await bookingService.addBookings(req.body);
  res.status(httpStatus.OK).send({ success: true, message: "Successfully Updated", result });
});

module.exports = {
  // createFastBooking,
  verifyCartAndCreateBooking,
  // createBooking,
  deleteBooking,
  getBooking,
  queryBooking,
  updateBooking,
  getDashboardData,
};
