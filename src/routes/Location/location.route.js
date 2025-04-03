const express = require("express");
const { locationController } = require("../../controllers");
// const upload = require("../../middlewares/multer");
const { verify } = require("../../middlewares/auth");
const router = express.Router();
const locationValidation = require("../../validations/location.validation");
const validate = require("../../middlewares/validate");
const { handleUpload } = require("../../middlewares/multers3");

// router
//   .route("/")
//   .get(
//     validate(locationValidation.getLocations),
//     locationController.queryLocation
//   )
//   .post(verify(["vendor", "admin"]), locationController.createLocation);
router
  .route("/")
  .get(
    // validate(locationValidation.getLocations),
    locationController.queryLocation
  )
  .post(
    handleUpload(true),
    verify(["vendor", "admin"]),
    locationController.createLocation
  );

router
  .route("/image/:id")
  .delete(
    validate(locationValidation.deleteImage),
    locationController.deleteImage
  );

router
  .route("/:id")
  .get(verify(), locationController.getLocation)
  .delete(verify(["vendor", "admin"]), locationController.deleteLocation)
  .put(
    verify(["vendor", "admin"]),
    handleUpload(false),
    locationController.updateLocation
  );

// router.route("/image/delete").delete(verify(),locationController.deleteImageByKey)

module.exports = router;
