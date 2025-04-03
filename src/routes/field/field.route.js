const express = require("express");
const { fieldController } = require("../../controllers");
// const upload = require("../../middlewares/multer")
const router = express.Router();
const fieldValidation = require("../../validations/field.valdiation");
const validate = require("../../middlewares/validate");
const { handleUpload } = require("../../middlewares/multers3");

router
  .route("/")
  .get(validate(fieldValidation.queryField), fieldController.queryField)
  .post(handleUpload(), fieldController.createField);

router
  .route("/image/:id")
  .delete(validate(fieldValidation.deleteImage), fieldController.deleteImage);

router
  .route("/:id")
  .get(validate(fieldValidation.getField), fieldController.getField)
  .delete(validate(fieldValidation.getField), fieldController.deleteField)
  .put(
    handleUpload(false),
    validate(fieldValidation.updateField),
    fieldController.updateField
  );

module.exports = router;
