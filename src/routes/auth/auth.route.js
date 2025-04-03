const express = require("express");
const { authController, userController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const userValidation = require("../../validations/user.validation");

const router = express.Router();

router.post("/login", validate(authValidation.login), authController.login);
router.post("/register", validate(userValidation.createUser), userController.createUser);

module.exports = router;
