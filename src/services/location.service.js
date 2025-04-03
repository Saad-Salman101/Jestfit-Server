const httpStatus = require("http-status");
const { Location } = require("../models");
const ApiError = require("../utils/APIError");

/**
 * Create a Location
 * @param {Object} LocationBody
 * @returns {Promise<Location>}
 */
const createLocation = async (body) => {
  const result = await Location.create(body);
  return result;
};

/**
 * Query for Location
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLocation = async (filter, options) => {
  const result = await Location.paginate(filter, options, "vendorID");
  return result;
};

/**
 * Get Location by id
 * @param {ObjectId} id
 * @returns {Promise<Location>}
 */
const getLocationById = async (id) => {
  const result = await Location.findById(id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Location not found");
  return result;
};

/**
 * Get Location by email
 * @param {string} email
 * @returns {Promise<Location>}
 */

/**
 * Update Location by id
 * @param {ObjectId} LocationId
 * @param {Object} updateBody
 * @returns {Promise<Location>}
 */
const updateLocationById = async (id, updateBody) => {
  const check = await getLocationById(id);
  if (!check) {
    throw new ApiError(httpStatus.NOT_FOUND, "Location not found");
  }
  const result = await Location.findByIdAndUpdate(id, updateBody, { new: true });
  return result;
};

/**
 * Delete Location by id
 * @param {ObjectId} LocationId
 * @returns {Promise<Location>}
 */
const deleteLocationById = async (LocationId) => {
  const location = await getLocationById(LocationId);
  const result = await Location.findByIdAndDelete(location.id);
  return result;
};

//soft Delete
const softDeleteLocationById = async (id) => {
  const location = await Location.findOne({ id, deletedAt: null });
  if (!location) throw new ApiError(httpStatus.NOT_FOUND, "Location not found");
  const result = await Location.findOneAndUpdate(
    { id },
    { deletedAt: new Date() },
    { new: true }
  );
  return result;
};

const removeImageFromLocationByID = async (ID, link) => {
  const result = await Location.findByIdAndUpdate(
    ID,
    { $pull: { images: { uri: link } } }, // Pull the image from the images array
    { new: true } // Return the updated field document
  );
  return result;
};

const addImagesToLocationByID = async (fieldID, images) => {
  const updatedField = await Location.findByIdAndUpdate(
    fieldID,
    { $push: { images: { $each: images } } }, // Add all images to the images array
    { new: true } // Return the updated field document
  );
  return updatedField;
};

module.exports = {
  addImagesToLocationByID,
  removeImageFromLocationByID,
  createLocation,
  queryLocation,
  getLocationById,
  updateLocationById,
  deleteLocationById,
  softDeleteLocationById,
};
