const httpStatus = require("http-status");
const { orderService, bookingService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { filter } = require("compression");
const { bookingStatus, paymentStatus } = require("../config/roles");
const { sendBookingConfirmation } = require("../services/mail.service");
const { findBooking } = require("../services/booking.service");

function addFiveHours(dateTime) {
  // Create a new Date object from the input to avoid mutating the original
  let newDateTime = new Date(dateTime);
  // Add 5 hours (5 * 60 * 60 * 1000 milliseconds)
  newDateTime.setTime(newDateTime.getTime() + 5 * 60 * 60 * 1000);
  return newDateTime;
}

const createOrder = catchAsync(async (req, res) => {
  console.log(req.body, "<==== incoming order creation body");
  let cart = req.body.cart;
  cart = cart.map((item) => {
    item.date = addFiveHours(item.date);
    item.slotID = item._id;
    delete item._id;
    return item;
  });
  console.log(cart, "<=== after changes");
  const conflicts = [];
  let message = "Bookings Created Successfully";

  // Check for conflicts in all bookings before any creation
  for (const bookingData of cart) {
    console.log(bookingData, "<=== booking data");
    const { date, slotID } = bookingData;

    // Find any conflicting bookings
    console.log(slotID, date, "<=== maal to search");
    const existingBookings = await findBooking({
      date: date,
      slotID: slotID,
    });
    console.log(existingBookings, "<==== existing bookings");

    if (existingBookings.length > 0) {
      // If conflicts exist, add them to the conflicts array and set the message
      message = "Conflicting bookings exist";
      conflicts.push({ bookingData, conflictingBookings: existingBookings });
    }
  } // If there are conflicts, return without creating order or bookings
  if (conflicts.length > 0) {
    return res.status(400).send({
      success: true,
      data: {
        conflicts,
        savedBookings: [],
      },
      message,
    });
  }
  const orderData = {
    type: req.body.type,
    customerID: cart[0].customerID ? cart[0].customerID : null,
    customerName: req.body?.customerName ? req.body?.customerName : null,
    image: "N/A",
    amount: parseFloat(cart.reduce((sum, item) => sum + item.price, 0)),
  };
  const order = await orderService.createOrder(orderData);
  console.log(order, "<=== yeh lora bana h");
  cart = cart.map((item) => {
    item.locationID =
      typeof item.locationID === "string" ? item.locationID : item.locationID.id;
    item.orderID = order.id;
    return item;
  });

  const cartData = await bookingService.createBooking(cart);
  // now we will work on booking data
  // const bookingData

  res.status(httpStatus.CREATED).send({
    success: true,
    message: "Successfully created order",
    result: { cartData, order },
  });
});

const createFastOrder = catchAsync(async (req, res) => {
  //check block//
  req.body.cartData = await JSON.parse(req.body.cartData);
  const conflicts = [];
  req.body.cartData = req.body.cartData.map((item) => {
    item.date = addFiveHours(item.date);
    item.slotID = item._id;
    delete item._id;
    return item;
  });
  for (const bookingData of req.body.cartData) {
    console.log(bookingData, "<====slot data");
    const { date, slotID } = bookingData;

    // Find any conflicting bookings
    const existingBookings = await findBooking({
      date: date,
      slotID: slotID,
    });

    if (existingBookings.length > 0) {
      // If conflicts exist, add them to the conflicts array and set the message
      message = "Conflicting bookings exist";
      conflicts.push({ bookingData, conflictingBookings: existingBookings });
    }
  } // If there are conflicts, return without creating order or bookings
  if (conflicts.length > 0) {
    return res.status(400).send({
      success: false,
      data: {
        conflicts,
        savedBookings: [],
      },
      message,
    });
  }

  //check block//

  const orderData = {
    paymentStatus: "paid",
    bookingStatus: "confirmed",
    customerID: req.body.cartData[0].customerID,
    image: "N/A",
    amount: parseFloat(req.body.amount),
  };

  const order = await orderService.createOrder(orderData);
  const body = req.body.cartData.map((item, index) => {
    delete item._id;
    return {
      locationID: typeof item.location === "string" ? item.locationID : item.locationID.id,
      customerName: req.body.name,
      fieldID: item.fieldID,
      price: item.price,
      to: item.to,
      from: item.from,
      date: addFiveHours(item.date),
      slotID: item.slotID,
      orderID: order.id,
      amount: req.body.amount,
      image: req.fileData ? req.fileData : "FastBooking",
    };
  });
  const result = await bookingService.createBooking(body);
  res.status(httpStatus.OK).send({ success: true, message: "Successfully Updated", result });
});

const queryOrders = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["paymentStatus", "customerID", "bookingStatus", "amount"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await orderService.queryOrder(filters, options);
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "Successfully fetched results", result });
});

const deleteOrder = catchAsync(async (req, res) => {
  const result = await orderService.deleteOrderById(req.params.id);
  res.status(httpStatus.OK).send({ success: true, message: "Successfully deleted", result });
});

const getOrderById = catchAsync(async (req, res) => {
  const result = await orderService.getOrderById(req.params.id);
  res.status(200).send({ success: true, message: "successfully fetched order", result });
});

const getAllOrder = catchAsync(async (req, res) => {
  const order = await orderService.getAllOrders();
  res.status(200).send(order);
});

const updateOrder = catchAsync(async (req, res) => {
  const result = await orderService.updateOrderById(req.params.id, req.body);
  console.log(result, "<=== ");
  if (result.bookingStatus === "confirmed" && result.customerID) {
    const bookings = await bookingService.getBookingsByOrderID(result.id);
    console.log(bookings, result, "<== final");
    sendBookingConfirmation(bookings, result);
  }
  res.status(200).send({ success: true, message: "Successfully Updated", result });
});

const confirmPayment = catchAsync(async (req, res) => {
  console.log(req.body);
  console.log(req.filesData);
  if (!req.body.orderID) {
    return res.status(400).send({ success: false, message: "no order id", result: null });
  }
  const order = await orderService.getOrderById(req.body.orderID);
  if (!req.filesData) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "Image proof for payment is required", success: false, result: null });
  }

  const result = await orderService.updateOrderById(req.body.orderID, {
    paymentStatus: "paid",
    image: req.filesData[0],
  });
  const slots = await bookingService.updateBookings(
    { orderID: result.id },
    { expiresAt: null }
  );
  console.log(slots, "<===slots ");
  res.status(200).send({ success: true, message: "Successfully Updated", result });
});

const confirmPaymentForFastBooking = catchAsync(async (req, res) => {
  console.log("##############################################");
  console.log(req.body);
  console.log("##############################################");
  if (!req.body.orderID) {
    return res.status(400).send({ success: false, message: "no order id", result: null });
  }
  const order = await orderService.getOrderById(req.body.orderID);
  const result = await orderService.updateOrderById(req.body.orderID, {
    type: "fastBooking",
    paymentStatus: "paid",
  });
  const slots = await bookingService.updateBookings(
    { orderID: result.id },
    { expiresAt: null }
  );
  console.log(slots, "<===slots ");
  res.status(200).send({ success: true, message: "Successfully Updated", result });
});

module.exports = {
  createFastOrder,
  createOrder,
  deleteOrder,
  getOrderById,
  getAllOrder,
  queryOrders,
  updateOrder,
  confirmPayment,
  confirmPaymentForFastBooking,
};
