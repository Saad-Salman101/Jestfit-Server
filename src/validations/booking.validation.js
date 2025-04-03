const Joi = require("joi");
const { password, objectId } = require("./custom.validation");
const { paymentStatus, bookingStatus } = require("../config/roles");

const queryCityValidation = (value, helper) => {
  const cleanedValue = {};
  for (const key in value) {
    if (Object.hasOwn(value, key)) {
      if (typeof value[key] === "string" && value[key] === "") {
        continue;
      }
      cleanedValue[key] = value[key];
    }
  }
  return cleanedValue;
};

const queryBooking = {
  query: Joi.object()
    .keys({
      date: Joi.date().empty(""),
      orderID: Joi.string().custom(objectId).empty(""),
      locationID: Joi.string().custom(objectId).empty(""),
      fieldID: Joi.string().custom(objectId).empty(""),
      vendorID: Joi.string().custom(objectId).empty(""),
      customerID: Joi.string().custom(objectId).empty(""),
      createdAt: Joi.date().empty(""),
      paymentStatus: Joi.string()
        .valid(...paymentStatus)
        .empty(""),
      bookingStatus: Joi.string().valid(bookingStatus).empty(""),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    })
    .options({ stripUnknown: true })
    .custom(queryCityValidation),
};

const getBooking = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const createBooking = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    address: Joi.string().required(),
    tags: Joi.array(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    vendorID: Joi.any(),
  }),
};

const createFastBooking = {
  body: Joi.object()
    .keys({
      customerName: Joi.string().optional(), // Name is optional (part of the or condition)
      customerEmail: Joi.string().email().optional(), // Email is optional (part of the or condition)
      customercontactNumber: Joi.string().optional(), // Phone is optional (part of the or condition)
      customerID: Joi.string(),
      fieldID: Joi.string().required(),
      locationID: Joi.string().required(),
      description: Joi.string().required(),
      address: Joi.string().required(),
      tags: Joi.array(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      vendorID: Joi.any(),
    })
    .or("name", "email", "phone"), // At least one of name, email, or phone is required
};

const updateBooking = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    paymentStatus: Joi.string().valid(...paymentStatus),
    bookingStatus: Joi.string().valid(...bookingStatus),
  }),
};

module.exports = {
  queryBooking,
  getBooking,
  createBooking,
  updateBooking,
};
