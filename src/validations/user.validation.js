const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string(),
    phoneNumber: Joi.string().required(),
    isVendor: Joi.boolean().required(),
    companyName: Joi.when("isVendor", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string().optional(),
    }),
    slogan: Joi.when("isVendor", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string().optional(),

    }),
    description: Joi.when("isVendor", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string().optional(),
    }),
    companyPhoneNumber: Joi.when("isVendor", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string().optional(),
    }),
    vendorPackageID: Joi.when("isVendor", {
      is: true,
      then: Joi.custom(objectId),
      otherwise: Joi.custom(objectId).optional(),
    }),

  }),
};

const getUsers = {
  query: Joi.object().keys({
    role: Joi.string(),
    email: Joi.string(),
    userType: Joi.string(),
    isVendor: Joi.string(),
    phoneNumber: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

const updateUser = {
  paramas: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    phoneNumber: Joi.string(),
    password: Joi.string().custom(password),
  })
}

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser
};
