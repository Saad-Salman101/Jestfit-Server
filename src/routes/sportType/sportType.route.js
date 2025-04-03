const express = require("express");
const { sportTypeController } = require("../../controllers");
const upload = require("../../middlewares/multer");
const { verify } = require("../../middlewares/auth");
const router = express.Router();

router
    .route("/")
    .get(verify(), sportTypeController.querySportTypes)
    .post(verify(["vendor", "admin"]), sportTypeController.createSportType);

router
    .route("/:id")
    .get(verify(), sportTypeController.getSportTypeById)
    .delete(verify(["vendor", "admin"]), sportTypeController.deleteSportType)
    .put(verify(["vendor", "admin"]), sportTypeController.updateSportType);

module.exports = router;
