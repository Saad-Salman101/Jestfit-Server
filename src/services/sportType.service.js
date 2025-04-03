const httpStatus = require("http-status");
const { SportType } = require("../models");
const ApiError = require("../utils/APIError");

/**
 * Create a SportType
 * @param {Object} SportTypeBody
 * @returns {Promise<SportType>}
 */
const createSportType = async (body) => {
  const result = await SportType.create(body);
  return result;
};

/**
 * Query for SportType
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortSportType:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySportType = async (filter, options) => {
  const result = await SportType.paginate(filter, options);
  return result;
};

/**
 * Get SportType by id
 * @param {ObjectId} id
 * @returns {Promise<SportType>}
 */
const getSportTypeById = async (id) => {
  const result = await SportType.findById(id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "SportType not found");
  return result;
};

/**
 * Get SportType by email
 * @param {string} email
 * @returns {Promise<SportType>}
 */

/**
 * Update SportType by id
 * @param {ObjectId} SportTypeId
 * @param {Object} updateBody
 * @returns {Promise<SportType>}
 */
const updateSportTypeById = async (id, updateBody) => {
  const check = await getSportTypeById(id);
  const result = await SportType.findByIdAndUpdate(id, updateBody, { new: true });
  return result;
};

/**
 * Delete SportType by id
 * @param {ObjectId} SportTypeId
 * @returns {Promise<SportType>}
 */
const deleteSportTypeById = async (SportTypeId) => {
  const location = await getSportTypeById(SportTypeId);
  const result = await SportType.findByIdAndDelete(location.id);
  return result;
};

const getSportTypeByName = async (name) => {
  const result = await SportType.findOne({ name });
  return result;
};

module.exports = {
  createSportType,
  querySportType,
  getSportTypeByName,
  getSportTypeById,
  updateSportTypeById,
  deleteSportTypeById,
};
