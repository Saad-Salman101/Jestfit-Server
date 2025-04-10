const Joi = require("joi");
const pick = require("../utils/pick");
const httpStatus = require("http-status");
const ApiError = require("../utils/APIError");

// const validate = (schema) => (req, res, next) => {
//   const validSchema = pick(schema, ["params", "query", "body"]);
//   const object = pick(req, Object.keys(validSchema));
//   const { value, error } = Joi.compile(validSchema)
//     .prefs({ errors: { label: "key" } })
//     .validate(object);

//   if (error) {
//     console.error("sss", error);
//     const errorMessage = error.details
//       .map((details) => details.message)
//       .join(", ");
//     return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
//   }
//   Object.assign(req, value);
//   return next();
// };

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" } })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};
module.exports = validate;
