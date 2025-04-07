const httpStatus = require("http-status");
const { locationService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const {
  removeImageFromLocationByID,
  addImagesToLocationByID,
} = require("../services/location.service");
const { deleteImageBylink } = require("../middlewares/s3Functions");
const { addImagesToFieldByID } = require("../services/field.service");

// create location in S3 code working
const createLocation = catchAsync(async (req, res) => {
  // console.log(req.filesData, "<=-- files");
  // const mybody = JSON.parse(req.formData);
  // const formData = new FormData(req.body);
  console.log("req.body", req.files);
  console.log(req.filesData, "<=-- files");
  console.log(req.body, "<== wah");
  //for local storage
  if (req.filesData) {
    let images = req.filesData.map((image, i) => {
      return {
        uri: image,
      };
    });
    req.body.images = images;
  }
  // console.log(req.body, "<====");
  const result = await locationService.createLocation(req.body);
  // res.send(req.body)
  res
    .status(httpStatus.CREATED)
    .send({ success: true, message: "Successfully created Location", result });
});

// create Location in localStorage
// const createLocation = catchAsync(async (req, res) => {
//   console.log("req.body", req.body);
//   console.log(req.filesData, "<=-- files");

//   // For local storage
//   if (req.filesData) {
//     let images = req.filesData.map((image, i) => {
//       return {
//         uri: image, // Local file path
//       };
//     });
//     req.body.images = images;
//   }

//   const result = await locationService.createLocation(req.body);
//   res
//     .status(httpStatus.CREATED)
//     .send({ success: true, message: "Successfully created Location", result });
// });

// const createLocation = catchAsync(async (req, res) => {
//   console.log(req.filesData, "<=-- files");
//   console.log(req.body, "<== wah");
//   //for local storage
//   if (req.filesData) {
//     let images = req.filesData.map((image, i) => {
//       return {
//         uri: image,
//       };
//     });
//     req.body.images = images;
//   }
//   // console.log(req.body, "<====");
//   const result = await locationService.createLocation(req.body);
//   // res.send(req.body)
//   res
//     .status(httpStatus.CREATED)
//     .send({ success: true, message: "Successfully created Location", result });
// });

const queryLocation = catchAsync(async (req, res) => {
  console.log(req.query, "<=== query");
  const filters = pick(req.query, ["name", "block", "tags", "vendorID"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await locationService.queryLocation(filters, options);
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "Successfully fetched results", result });
});

const deleteLocation = catchAsync(async (req, res) => {
  const result = await locationService.deleteLocationById(req.params.id);
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "Successfully deleted", result: result });
});

const getLocation = catchAsync(async (req, res) => {
  const result = await locationService.getLocationById(req.params.id);
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "successfully fetched Location", result });
});

const updateLocation = catchAsync(async (req, res) => {
  if (req.filesData.length !== 0) {
    let images = req.filesData.map((image, i) => {
      return {
        uri: image,
      };
    });
    req.body.images = images;
    await addImagesToLocationByID(req.params.id, images);
  }
  const result = await locationService.updateLocationById(
    req.params.id,
    req.body
  );
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "Successfully Updated", result });
});

const deleteImageByKey = catchAsync(async (req, res) => {
  const result = await locationService.updateLocationById(
    req.params.id,
    req.body
  );
  res
    .status(httpStatus.OK)
    .send({ success: true, message: "Successfully Updated", result });
});

const deleteImage = catchAsync(async (req, res) => {
  if (!req.query.link) {
    return res
      .status(400)
      .send({ success: false, message: "No link found", result: null });
  }

  const updateField = await removeImageFromLocationByID(
    req.params.id,
    req.query.link
  );
  const result = await deleteImageBylink(req.query.link);
  if (!result) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: "unable to delete image",
      result: null,
    });
  }
  res.status(httpStatus.OK).send({
    success: true,
    message: "Successfully deletedImage",
    result: updateField,
  });
});

module.exports = {
  deleteImage,
  createLocation,
  deleteLocation,
  getLocation,
  queryLocation,
  updateLocation,
};
