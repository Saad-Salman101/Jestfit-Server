const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { required } = require("joi");

const slotsSchema = mongoose.Schema({
  to: { type: String, required: true },
  from: { type: String, required: true },
  price: { type: Number, required: true },
  isEnabled: { type: Boolean, required: true, default: true },
});

const fieldImagesSchema = mongoose.Schema({
  uri: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const fieldSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sportTypeID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "SportType" },
    price: { type: Number, required: true },
    priceDiscount: { type: Number },
    slots: [slotsSchema],
    images: [fieldImagesSchema],
    vendorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    locationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
fieldSchema.plugin(toJSON);
fieldSchema.plugin(paginate);

const Field = mongoose.model("Field", fieldSchema);
module.exports = Field;
