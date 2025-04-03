const httpStatus = require("http-status");
const { userService, vendorService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");


const createUser = catchAsync(async (req, res) => {
  console.log(req.body)
  if (req.body.isVendor) {
    let vendorBody = pick(req.body, ["companyName", "slogan", "description", "companyPhoneNumber", "vendorPackageID"]);
    delete req.body.companyName;
    delete req.body.slogan
    delete req.body.description
    delete req.body.companyPhoneNumber
    delete req.body.vendorPackageId
    delete req.body.isVendor
    let vendorResult = await vendorService.createVendor(vendorBody)
    req.body.vendorID = vendorResult.id
  }
  const result = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ success: true, message: "Successfully created user", result });
});

const queryUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["email", "number", "userType", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filters, options)
  res.status(httpStatus.OK).send({ success: true, message: "Successfully fetched results", result })
})


const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.deleteUserById(req.params.id);
  res.status(httpStatus.OK).send({ success: true, message: "Successfully deleted", result: true });
});

const getUserById = catchAsync(async (req, res) => {
  const result = await userService.getUserById(req.params.id);
  res.status(200).send({ success: true, message: "successfully fetched user", result });
});

const getAllUser = catchAsync(async (req, res) => {
  const user = await userService.getAllUsers();
  res.status(200).send(user);
});

const updateUserById = catchAsync(async (req, res) => {
  const userData = pick(req.body, ["firstName", "lastName", "phoneNumber", "email"])
  const vendorData = pick(req.body, ["companyName", "slogan", "description", "companyPhoneNumber", "status", "customerMonthlyCharges"]);
  const user = await userService.updateUserById(req.params.id, userData);
  const vendor = await vendorService.updateVendorById(user.vendorID, vendorData);
  res.status(200).send({ success: true, result: { vendor, user }, message: "Successfully Updated User" });
});

module.exports = {
  createUser,
  deleteUser,
  getUserById,
  getAllUser,
  queryUsers,
  updateUserById,
};
