const httpStatus = require("http-status");
const { PaymentPortal } = require("../models");
const ApiError = require("../utils/APIError");

/**
 * Create a PaymentPortal
 * @param {Object} PaymentPortalBody
 * @returns {Promise<PaymentPortal>}
 */
const createPaymentPortal = async (body) => {
    const result = await PaymentPortal.create(body);
    return result;
};

/**
 * Query for PaymentPortal
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPaymentPortal = async (filter, options) => {
    const result = await PaymentPortal.paginate(filter, options);
    return result;
};


/**
 * Get PaymentPortal by id
 * @param {ObjectId} id
 * @returns {Promise<PaymentPortal>}
 */
const getPaymentPortalById = async (id) => {
    const result = await PaymentPortal.findById(id);
    if (!result)
        throw new ApiError(httpStatus.NOT_FOUND, "PaymentPortal not found");
    return result;
};

/**
 * Get PaymentPortal by email
 * @param {string} email
 * @returns {Promise<PaymentPortal>}
 */

/**
 * Update PaymentPortal by id
 * @param {ObjectId} PaymentPortalId
 * @param {Object} updateBody
 * @returns {Promise<PaymentPortal>}
 */
const updatePaymentPortalById = async (id, updateBody) => {
    const check = await getPaymentPortalById(id);
    if (!check) {
        throw new ApiError(httpStatus.NOT_FOUND, "PaymentPortal not found");
    }
    const result = await PaymentPortal.findByIdAndUpdate(id, updateBody, { new: true })
    return result
};

/**
 * Delete PaymentPortal by id
 * @param {ObjectId} PaymentPortalId
 * @returns {Promise<PaymentPortal>}
 */
const deletePaymentPortalById = async (PaymentPortalId) => {
    const location = await getPaymentPortalById(PaymentPortalId);
    const result = await PaymentPortal.findByIdAndDelete(location.id)
    return result;
};

module.exports = {
    createPaymentPortal,
    queryPaymentPortal,
    getPaymentPortalById,
    updatePaymentPortalById,
    deletePaymentPortalById,
};
