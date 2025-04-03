const httpStatus = require("http-status");
const { authService, tokenService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(200).send({ result: { user, tokens }, success: true, message: "Successfully logged in !" });
});

module.exports = {
  login
};
