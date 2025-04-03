const httpStatus = require("http-status");
const { SlotDisabler } = require("../models");
const ApiError = require("../utils/APIError");

/**
 * Create a SlotDisabler
 * @param {Object} SlotDisablerBody
 * @returns {Promise<SlotDisabler>}
 */
const createSlotDisabler = async (body) => {
  const result = await SlotDisabler.insertMany(body);
  return result;
};  

/**
 * Query for SlotDisabler
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySlotDisabler = async (filter, options) => {
  const result = await SlotDisabler.paginate(filter, options);
  return result;
};

/**
 * Get SlotDisabler by id
 * @param {ObjectId} id
 * @returns {Promise<SlotDisabler>}
 */
const getSlotDisablerById = async (id) => {
  const result = await SlotDisabler.findById(id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "SlotDisabler not found");
  return result;
};

/**
 * Get SlotDisabler by email
 * @param {string} email
 * @returns {Promise<SlotDisabler>}
 */

/**
 * Update SlotDisabler by id
 * @param {ObjectId} SlotDisablerId
 * @param {Object} updateBody
 * @returns {Promise<SlotDisabler>}
 */
const updateSlotDisablerById = async (id, updateBody) => {
  const check = await getSlotDisablerById(id);
  if (!check) {
    throw new ApiError(httpStatus.NOT_FOUND, "SlotDisabler not found");
  }
  const result = await SlotDisabler.findByIdAndUpdate(id, updateBody, { new: true });
  return result;
};

/**
 * Delete SlotDisabler by id
 * @param {ObjectId} SlotDisablerId
 * @returns {Promise<SlotDisabler>}
 */
const deleteSlotDisablerById = async (SlotDisablerId) => {
  const location = await getSlotDisablerById(SlotDisablerId);
  const result = await SlotDisabler.findByIdAndDelete(location.id);
  return result;
};

module.exports = {
  createSlotDisabler,
  querySlotDisabler,
  getSlotDisablerById,
  updateSlotDisablerById,
  deleteSlotDisablerById,
};
