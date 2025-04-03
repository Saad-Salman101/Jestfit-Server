const dotenv = require("dotenv");
const Joi = require("joi");
const path = require("path");
const { password } = require("../validations/custom.validation");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("production", "development", "test").required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    MONGODB_DEV_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description("the from field in the emails sent by the app"),
    REDIS_URL: Joi.string().description("Required to run redis conn"),
    REDIS_PORT: Joi.number().required().description("Port number required"),
    S3_BUCKET_NAME: Joi.string().description("s3 bucket name"),
    S3_BUCKET_ACCESS_KEY: Joi.string()
      .required("s3 bucket key required")
      .description("s3 bucket access key "),
    S3_BUCKET_SECRET_KEY: Joi.string()
      .required()
      .description("s3 bucket secret key is required"),
    S3_BUCKET_REGION: Joi.string().required().description("s3 bucket region"),
    MAILER_ID: Joi.string().required().description("email for id"),
    MAILER_PASSWORD: Joi.string().required().description("appkey for nodemailer"),
  })
  .unknown();

const { value: envVars, error } = envVarSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config Validation error: ${error.message}`);
}

module.exports = {
  redis: {
    url: envVars.REDIS_URL,
    port: envVars.REDIS_PORT,
  },
  AWS: {
    S3: {
      accessKey: envVars.S3_BUCKET_ACCESS_KEY,
      secretKey: envVars.S3_BUCKET_SECRET_KEY,
      region: envVars.S3_BUCKET_REGION,
      name: envVars.S3_BUCKET_NAME,
    },
  },
  mailer: {
    email: envVars.MAILER_ID,
    password: envVars.MAILER_PASSWORD,
  },
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.NODE_ENV === "production" ? envVars.MONGODB_URL : envVars.MONGODB_DEV_URL,
    options: {
      // useCreateIndex: true,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
};
