const httpStatus = require("http-status");
const { Order } = require("../models");
const ApiError = require("../utils/APIError");
const bookingService = require("./booking.service");

/**
 * Create a Order
 * @param {Object} OrderBody
 * @returns {Promise<Order>}
 */
const createOrder = async (body) => {
  const result = await Order.create(body);
  return result;
};

/**
 * Query for Order
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrder = async (filter, options) => {
  const result = await Order.paginate(filter, options, [{ path: "customerID" }]);
  return result;
};

/**
 * Get Order by id
 * @param {ObjectId} id
 * @returns {Promise<Order>}
 */
const getOrderById = async (id) => {
  const result = await Order.findById(id).populate("customerID");
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  const bookings = await bookingService.getBookingsByOrderID(result.id);
  return { order: result, bookings };
};

/**
 * Get Order by email
 * @param {string} email
 * @returns {Promise<Order>}
 */

/**
 * Update Order by id
 * @param {ObjectId} OrderId
 * @param {Object} updateBody
 * @returns {Promise<Order>}
 */
const updateOrderById = async (id, updateBody) => {
  const check = await getOrderById(id);
  if (!check) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }
  const orderUpdate = await Order.findByIdAndUpdate(id, updateBody, { new: true });
  if (!orderUpdate) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update order at this time");
  }
  const order = await Order.findById(id).populate("customerID");
  return order;
};

/**
 * Delete Order by id
 * @param {ObjectId} OrderId
 * @returns {Promise<Order>}
 */
const deleteOrderById = async (OrderId) => {
  const location = await getOrderById(OrderId);
  const result = await Order.findByIdAndDelete(location.id);
  return result;
};

module.exports = {
  createOrder,
  queryOrder,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};
