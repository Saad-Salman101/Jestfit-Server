const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const httpStatus = require("http-status");
const config = require("./config/config");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const routes = require("./routes");
const ApiError = require("./utils/APIError");
const { errorConverter, errorHandler } = require("./middlewares/error");
const morgan = require("./config/morgan");
const path = require("path");

const app = express();

if (config.env !== "test") {
  if (config.env !== "test") {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
  }
}
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(mongoSanitize());
app.use(compression());
app.use(cors());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "client", "build")));
app.options("*", cors());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", routes);
app.use("/assets", express.static(path.join(__dirname, path.join("uploads"))));

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
