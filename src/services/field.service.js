const httpStatus = require("http-status");
const { Field } = require("../models");
const ApiError = require("../utils/APIError");

/**
 * Create a Field
 * @param {Object} FieldBody
 * @returns {Promise<Field>}
 */
const createField = async (body) => {
  const result = await Field.create(body);
  return result;
};

/**
 * Query for Field
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryField = async (filter, options) => {
  const result = await Field.paginate(filter, options, [
    {
      path: "locationID",
      populate: {
        path: "vendorID",
      },
    },
    {
      path: "sportTypeID",
    },
  ]);
  return result;
};

/**
 * Get Field by id
 * @param {ObjectId} id
 * @returns {Promise<Field>}
 */
const getFieldById = async (id) => {
  const result = await Field.findById(id).populate("locationID");
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Field not found");
  return result;
};

/**
 * Get Field by email
 * @param {string} email
 * @returns {Promise<Field>}
 */

/**
 * Update Field by id
 * @param {ObjectId} FieldId
 * @param {Object} updateBody
 * @returns {Promise<Field>}
 */
const updateFieldById = async (id, updateBody) => {
  const check = await getFieldById(id);
  if (updateBody.slots.length !== 0) {
    console.log("there were slots");
    console.log(updateBody.slots, "<=== madarchod");
    check.slots = updateBody.slots;
    check.save();
  }
  console.log(updateBody, "<=== final body");
  const result = await Field.findByIdAndUpdate(check.id, updateBody, { new: true });
  return result;
};

/**
 * Delete Field by id
 * @param {ObjectId} FieldId
 * @returns {Promise<Field>}
 */
const deleteFieldById = async (FieldId) => {
  const location = await getFieldById(FieldId);
  //   const result = await Field.findByIdAndDelete(location.id);
  const result = await Field.findByIdAndUpdate(
    location.id,
    { deletedAt: new Date() },
    { new: true }
  );
  return result;
};

const removeImageFromFieldByID = async (fieldID, link) => {
  const result = await Field.findByIdAndUpdate(
    fieldID,
    { $pull: { images: { uri: link } } }, // Pull the image from the images array
    { new: true } // Return the updated field document
  );
  return result;
};

const addImagesToFieldByID = async (fieldID, images) => {
  const updatedField = await Field.findByIdAndUpdate(
    fieldID,
    { $push: { images: { $each: images } } }, // Add all images to the images array
    { new: true } // Return the updated field document
  );
  return updatedField;
};

module.exports = {
  removeImageFromFieldByID,
  createField,
  queryField,
  getFieldById,
  updateFieldById,
  deleteFieldById,
  addImagesToFieldByID,
};
