const httpStatus = require("http-status");
const { VendorPackage } = require("../models");
const mongoose = require("mongoose");
const ApiError = require("../utils/APIError");
const { ObjectId } = require('mongodb');

/**
 * Create a VendorPackage
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createVendorPackage = async (body) => {
    const result = await VendorPackage.create(body);
    return result;
};

/**
 * Query for VendorPackages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryVendorPackage = async (filter, options) => {
    const result = await VendorPackage.paginate(filter, options);
    return result;
};


const getVendorPackageById = async (id) => {
    const result = VendorPackage.findOne({ _id: id, deletedAt: null });
    if (!result)
        throw new ApiError(httpStatus.BAD_REQUEST, "Vendor Package does not exist")
    return result;
};



const deleteVendorPackageById = async (id) => {
    const check = await VendorPackage.findById(id)
    if (!check) {
        throw new ApiError(httpStatus.NOT_FOUND, "VendorPackage not found");
    }
    const result = await VendorPackage.findByIdAndDelete(id)
    return result;
};



const softdeleteVendorPackageById = async (id) => {
    const check = await getVendorPackageById(id)
    if (!check) {
        throw new ApiError(httpStatus.NOT_FOUND, "VendorPackage not found");
    }
    const result = await VendorPackage.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true })
    return result;
};

const updateVendorPackageById = async (id, body) => {
    const check = await getVendorPackageById(id)
    if (!check) {
        throw new ApiError(httpStatus.NOT_FOUND, "VendorPackage not found");
    }
    const result = await VendorPackage.findByIdAndUpdate(id, body, { new: true });
    return result;
};

module.exports = {
    createVendorPackage,
    queryVendorPackage,
    getVendorPackageById,
    deleteVendorPackageById,
    updateVendorPackageById
};
