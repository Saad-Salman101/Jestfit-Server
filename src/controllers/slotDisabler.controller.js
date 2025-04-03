const httpStatus = require("http-status");
const { slotDisablerService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");

const createSlotDisabler = catchAsync(async (req, res) => {
  // const checkSportName = await slotDisablerService.getSlotDisablerByName(req.body.name);
  // if (checkSportName) {
  //     return res.status(httpStatus.BAD_REQUEST).send({ success: false, result: null, message: "Sport type already exists" });
  // }
  console.log(req.body, "<===== ");
  const result = await slotDisablerService.createSlotDisabler(req.body);
  res
    .status(httpStatus.CREATED)
    .send({ success: true, message: "Successfully created slotDisabler", result });
});

const querySlotDisabler = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["name"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await slotDisablerService.querySlotDisabler(filters, options);
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "Successfully fetched results", result });
});

const deleteSlotDisabler = catchAsync(async (req, res) => {
  const result = await slotDisablerService.deleteSlotDisablerById(req.params.id);
  res.status(httpStatus.OK).send({ success: true, message: "Successfully deleted", result });
});

const getSlotDisablerById = catchAsync(async (req, res) => {
  const result = await slotDisablerService.getSlotDisablerById(req.params.id);
  res
    .status(200)
    .send({ success: true, message: "successfully fetched slotDisabler", result });
});

const getAllSlotDisabler = catchAsync(async (req, res) => {
  const slotDisabler = await slotDisablerService.getAllSlotDisablers();
  res.status(200).send(slotDisabler);
});

const updateSlotDisabler = catchAsync(async (req, res) => {
  const result = await slotDisablerService.updateSlotDisablerById(req.params.id, req.body);
  res.status(200).send({ success: true, message: "Successfully Updated", result });
});

module.exports = {
  createSlotDisabler,
  deleteSlotDisabler,
  getSlotDisablerById,
  getAllSlotDisabler,
  querySlotDisabler,
  updateSlotDisabler,
};
