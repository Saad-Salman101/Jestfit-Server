const httpStatus = require("http-status");
const { Product } = require("../models");
const ApiError = require("../utils/APIError");
const queryProducts = async (filter, options, populateFirst = null, populateSecond = null) => {
  const products = Product.paginate(filter, options, populateFirst, populateSecond);
  return products;
};
const getProductById = async (id) => {
  return Product.findById(id);
};

const getAllProducts = async () => {
  const user = await Product.find().populate("vendor");
  return user;
};

const updateProductById = async (id, update) => {
  const product = await getProductById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found.");
  }
  const result = await Product.findByIdAndUpdate(id, update, { new: true });
  return result;
};
const createProduct = async (body) => {
  const product = await Product.create(body);
  return product;
};
const deleteProductById = async (id) => {
  const product = await getProductById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found.");
  }
  await product.remove();
  return product;
};
module.exports = {
  createProduct,
  getAllProducts,
  queryProducts,
  updateProductById,
  getProductById,
  deleteProductById,
};
