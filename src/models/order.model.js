const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { required, string, number } = require("joi");
const orderSchema = mongoose.Schema(
  {
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    customerName: {
      type: String,
    },
    customerContactNumber: {
      type: String,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    paymentStatus: {
      type: String,
      default: "verifying",
    },
    bookingStatus: {
      type: String,
      default: "processing",
    },
    image: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      default: "web",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
