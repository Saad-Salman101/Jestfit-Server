const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { required, string, number } = require("joi");
const bookingSchema = mongoose.Schema(
  {
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //   required: true,
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
    fieldID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },
    locationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    vendorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      require: true,
    },
    orderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    slotID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field.slots",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
bookingSchema.plugin(toJSON);
bookingSchema.plugin(paginate);
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
