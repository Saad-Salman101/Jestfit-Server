const { vendorService, userService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const pick = require("../utils/pick");

const createVendor = catchAsync(async (req, res) => {
  const vendor = await vendorService.createVendor(req.body);
  res.status(httpStatus.CREATED).send({ success: true, message: "Thank you for your registration", data: vendor });
});

const queryVendors = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["email", "number", "userType"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await vendorService.queryVendors(filters, options)
  res.status(httpStatus.OK).send({ success: true, message: "Successfully fetched results", result })
})

const getVendor = catchAsync(async (req, res) => {
  const vendor = await vendorService.getVendorById(req.params.id);
  res.status(200).send({ success: true, message: "Successfully fetched Vendor", result: vendor });

});
const deleteVendor = catchAsync(async (req, res) => {
  const vendor = await vendorService.deleteVendorById(req.params.id);
  res.status(200).send({ success: true, message: "Successfully deleted vendor", result: vendor });
});


const updateVendor = catchAsync(async (req, res) => {
  const userData = pick(req.body, ["firstName", "lastName", "phoneNumber", "email"])
  const vendorData = pick(req.body, ["companyName", "slogan", "description", "companyPhoneNumber", "status", "customerMonthlyCharges"]);
  const user = await userService.updateUserById(req.params.id, userData);
  const vendor = await vendorService.updateVendorById(user.vendorId, vendorData);
  res.status(200).send({ success: true, result: { vendor, user }, message: "Successfully updated Vendor" });
});
module.exports = {
  createVendor,
  queryVendors,
  getVendor,
  deleteVendor,
  updateVendor
};
