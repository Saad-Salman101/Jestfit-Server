const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const { required } = require("joi");
const paymentPortalSchema = mongoose.Schema(
    {
        gatewayName: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        accountNumber: {
            type: String,
            required: true,
        },
        image: {
            type: String
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            required: true
        }
    },
    {
        timestamps: true,
    }
);
// add plugin that converts mongoose to json
paymentPortalSchema.plugin(toJSON);
paymentPortalSchema.plugin(paginate);
const PaymentPortal = mongoose.model("PaymentPortal", paymentPortalSchema);
module.exports = PaymentPortal;
