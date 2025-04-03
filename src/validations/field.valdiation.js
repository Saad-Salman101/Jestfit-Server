const Joi = require("joi");
const { objectId } = require("./custom.validation");

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
  console.log(cleanedValue, "<==== wow");
  return cleanedValue;
};

const queryField = {
  query: Joi.object()
    .keys({
      name: Joi.string().empty(""),
      vendorID: Joi.string().empty(""),
      locationID: Joi.string().empty(),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    })
    .options({ stripUnknown: true })
    .custom(queryCityValidation),
};

const getField = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const createField = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    address: Joi.string().required(),
    tags: Joi.array(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    vendorID: Joi.custom(objectId),
  }),
};

const updateField = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
    priceDiscount: Joi.number(),
    slots: Joi.any(),
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
  queryField,
  getField,
  createField,
  updateField,
  deleteImage,
  deleteImage,
};
