const httpStatus = require("http-status");
const { Vendor } = require("../models");
const mongoose = require("mongoose");
const ApiError = require("../utils/APIError");

/**
 * Create a Vendor
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createVendor = async (userBody) => {
  const user = await Vendor.create(userBody);
  return user;
};

/**
 * Query for Vendors
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryVendors = async (filter, options) => {
  const result = await Vendor.paginate(filter, options, "vendorPackageID");
  return result;
};


const getVendorById = async (id) => {
  const vendor = Vendor.findById(id);
  return vendor;
};

const deleteVendorById = async (id) => {
  const check = await getVendorById(id)
  if (!check) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  const vendor = await Vendor.findByIdAndDelete(id)
  return vendor;
};

const updateVendorById = async (id, body) => {
  const check = await getVendorById(id)
  if (!check) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  const vendor = await Vendor.findByIdAndUpdate(id, body, { new: true });
  return vendor;
};

module.exports = {
  createVendor,
  queryVendors,
  getVendorById,
  deleteVendorById,
  updateVendorById
};
