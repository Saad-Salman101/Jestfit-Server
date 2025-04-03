const express = require("express");
const { slotDisablerController } = require("../../controllers");
const upload = require("../../middlewares/multer");
const router = express.Router();
const validate = require("../../middlewares/validate");

router
  .route("/")
  .get(slotDisablerController.querySlotDisabler)
  .post(slotDisablerController.createSlotDisabler);

router
  .route("/:id")
  .get(slotDisablerController.getSlotDisablerById)
  .delete(slotDisablerController.deleteSlotDisabler)
  .put(slotDisablerController.updateSlotDisabler);

module.exports = router;
