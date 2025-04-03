const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const vendorSchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      minLength: 3,
    },
    slogan: {
      type: String,
    },
    description: {
      type: String,
    },
    companyPhoneNumber: {
      type: String,
    },
    vendorPackageID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorPackage",
    },
    customMonthlyCharges: {
      type: Number,
    },
    status: {
      type: String,
      default: "active",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

vendorSchema.plugin(toJSON);
vendorSchema.plugin(paginate);

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
