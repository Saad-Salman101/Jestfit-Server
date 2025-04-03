const httpStatus = require("http-status");
const { paymentPortalService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");

const createPaymentPortal = catchAsync(async (req, res) => {
  if (req.filesData.length === 0) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: "logo/image for payment gateway is required",
      result: null,
    });
  }
  req.body.image = req.filesData[0];
  const result = await paymentPortalService.createPaymentPortal(req.body);
  res
    .status(httpStatus.CREATED)
    .send({ success: true, message: "Successfully created paymentPortal", result });
});

const queryPaymentPortal = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["name", "accountNumber"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await paymentPortalService.queryPaymentPortal(filters, options);
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "Successfully fetched results", result });
});

const deletePaymentPortal = catchAsync(async (req, res) => {
  const result = await paymentPortalService.deletePaymentPortalById(req.params.id);
  res.status(httpStatus.OK).send({ success: true, message: "Successfully deleted", result });
});

const getPaymentPortal = catchAsync(async (req, res) => {
  const result = await paymentPortalService.getPaymentPortalById(req.params.id);
  res
    .status(200)
    .send({ success: true, message: "successfully fetched paymentPortal", result });
});

const getAllPaymentPortal = catchAsync(async (req, res) => {
  const paymentPortal = await paymentPortalService.getAllPaymentPortals();
  res.status(200).send(paymentPortal);
});

const updatePaymentPortal = catchAsync(async (req, res) => {
  const result = await paymentPortalService.updatePaymentPortalById(req.params.id, req.body);
  res.status(200).send({ success: true, message: "Successfully Updated", result });
});

module.exports = {
  createPaymentPortal,
  deletePaymentPortal,
  getPaymentPortal,
  getAllPaymentPortal,
  queryPaymentPortal,
  updatePaymentPortal,
};
