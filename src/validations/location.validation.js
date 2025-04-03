const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const queryCityValidation = (value, helper) => {
  const cleanedValue = {};
  console.log(value, "<=== wah");
  for (const key in value) {
    if (Object.hasOwn(value, key)) {
      if (typeof value[key] === "string" && value[key] === "") {
        continue;
      }
      cleanedValue[key] = value[key];
    }
  }
  console.log(cleanedValue, "<==== wow");
  return cleanedValue;
};

const getLocations = {
  query: Joi.object()
    .keys({
      name: Joi.string().empty(""),
      vendorID: Joi.string().empty(""),
      block: Joi.string().empty(""),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    })
    .options({ stripUnknown: true })
    .custom(queryCityValidation),
};

const getLocation = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const createLocation = {
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

const updateLocation = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string().custom(password),
    price: Joi.string(),
    quantity: Joi.string(),
  }),
};
const deleteImage = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    link: Joi.string().required(),
  }),
};
module.exports = {
  getLocation,
  getLocations,
  createLocation,
  updateLocation,
  deleteImage,
};
