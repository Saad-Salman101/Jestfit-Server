const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const locationImagesSchema = mongoose.Schema({
  uri: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const locationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    addressLineOne: {
      type: String,
      required: true,
    },
    block: {
      type: String,
    },
    city: {
      type: String,
    },
    tags: [{ type: String }],
    description: {
      type: String,
      required: true,
    },
    images: [locationImagesSchema],
    locationUrl: {
      type: String,
    },
    vendorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
locationSchema.plugin(toJSON);
locationSchema.plugin(paginate);
const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
