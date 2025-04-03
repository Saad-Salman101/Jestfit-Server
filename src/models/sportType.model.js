const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const sportTypeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
// add plugin that converts mongoose to json
sportTypeSchema.plugin(toJSON);
sportTypeSchema.plugin(paginate);
const SportType = mongoose.model("SportType", sportTypeSchema);
module.exports = SportType;
