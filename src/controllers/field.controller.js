const httpStatus = require("http-status");
const { fieldService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { deleteImageBylink } = require("../middlewares/s3Functions");
const {
  updateFieldById,
  getFieldById,
  removeImageFromFieldByID,
  addImagesToFieldByID,
} = require("../services/field.service");

const createField = catchAsync(async (req, res) => {
  //for local storage
  if (typeof req.body.slots === "string") {
    req.body.slots = JSON.parse(req.body.slots);
    req.body.slots = req.body.slots.map((slot, index) => {
      return { ...slot, price: parseInt(slot.price) };
    });
  }

  if (req.filesData) {
    let images = req.filesData.map((image, i) => {
      return {
        uri: image,
      };
    });
    req.body.images = images;
  }
  const result = await fieldService.createField(req.body);
  res
    .status(httpStatus.CREATED)
    .send({ success: true, message: "Successfully created Field", result });
});

const queryField = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    "name",
    "price",
    "sportTypeID",
    "locationID",
    "vendorID",
    "deletedAt",
    "status",
  ]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await fieldService.queryField(filters, options);
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "Successfully fetched results", result });
});

const deleteField = catchAsync(async (req, res) => {
  const result = await fieldService.deleteFieldById(req.params.id);
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "Successfully deleted", result: result });
});

const getField = catchAsync(async (req, res) => {
  const result = await fieldService.getFieldById(req.params.id);
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "successfully fetched Field", result });
});

const updateField = catchAsync(async (req, res) => {
  if (typeof req.body.slots === "string") {
    req.body.slots = JSON.parse(req.body.slots);
    req.body.slots = req.body.slots.map((slot, index) => {
      return { ...slot, price: parseInt(slot.price) };
    });
  }
  if (req.filesData.length !== 0) {
    let images = req.filesData.map((image, i) => {
      return {
        uri: image,
      };
    });
    req.body.images = images;
    await addImagesToFieldByID(req.params.id, images);
  }
  const result = await fieldService.updateFieldById(req.params.id, req.body);
  res.status(httpStatus.OK).send({ success: true, message: "Successfully Updated", result });
});

const deleteImage = catchAsync(async (req, res) => {
  if (!req.query.link) {
    return res.status(400).send({ success: false, message: "No link found", result: null });
  }

  const updateField = await removeImageFromFieldByID(req.params.id, req.query.link);
  const result = await deleteImageBylink(req.query.link);
  if (!result) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ success: false, message: "unable to delete image", result: null });
  }
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "Successfully deletedImage", result: updateField });
});

module.exports = {
  deleteImage,
  createField,
  deleteField,
  getField,
  queryField,
  updateField,
};
