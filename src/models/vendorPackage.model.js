const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const Schema = mongoose.Schema;
const vendorPackageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true,
});

vendorPackageSchema.plugin(toJSON);
vendorPackageSchema.plugin(paginate);


const VendorPackage = mongoose.model("VendorPackage", vendorPackageSchema);

module.exports = VendorPackage;