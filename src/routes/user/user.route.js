const { Router } = require("express");
const { userController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");

const router = Router();

router
  .route("/")
  .post(validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.queryUsers);
router
  .route("/:id")
  .get(validate(userValidation.getUser), userController.getUserById)
  .delete(validate(userValidation.getUser), userController.deleteUser)
  .put(validate(userValidation.updateUser), userController.updateUserById);

module.exports = router;
