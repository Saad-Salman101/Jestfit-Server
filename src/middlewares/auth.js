const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/APIError");
const { roleRights } = require("../config/roles");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { userService } = require("../services");

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) =>
      userRights.includes(requiredRight)
    );
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
    }
  }

  resolve();
};

// const auth =
//   (...requiredRights) =>
//   async (req, res, next) => {
//     return new Promise((resolve, reject) => {
//       passport.authenticate(
//         "jwt",
//         { session: false },
//         verifyCallback(req, resolve, reject, requiredRights)
//       )(req, res, next);
//     })
//       .then(() => next())
//       .catch((err) => next(err));
//   };

// module.exports = async function verify(req, res, next) {
//   const token = req.header("auth-token");

//   if (!token) return res.status(401).send("Access Denied");

//   try {
//     const varified = jwt.verify(token, config.jwt.secret);
//     const user = await userService.getUserById(varified.sub);
//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(400).send("Invalid Token");
//   }
// };

const verify =
  (roles = null) =>
  async (req, res, next) => {
    const token = req.header("Authorization");
    console.log(token, "<=== incoming token");
    if (!token) return res.status(401).send("Access Denied");
    try {
      const varified = jwt.verify(token, config.jwt.secret);
      const user = await userService.getUserById(varified.sub);
      let flag = false;
      if (roles) {
        for (let index = 0; index < roles.length; index++) {
          if (user.role === roles[index]) {
            flag = true;
          }
        }
        if (flag === true) {
          req.user = user;
          next();
        } else {
          throw new ApiError(httpStatus[401], "Access Denied");
        }
      } else {
        req.user = user;
        next();
      }
    } catch (err) {
      console.log(err, "<===eeee");
      res.status(400).send("Invalid Token");
    }
  };

module.exports = { verify };
