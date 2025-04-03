const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const slotDisablerSchema = mongoose.Schema(
  {
    fieldID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },
    day: {
      type: String,
    },
    date: {
      type: Date,
    },
    type: {
      type: String,
      enum: ["once", "recurring"],
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
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
slotDisablerSchema.plugin(toJSON);
slotDisablerSchema.plugin(paginate);
const SlotDisabler = mongoose.model("slotDisabler", slotDisablerSchema);
module.exports = SlotDisabler;
