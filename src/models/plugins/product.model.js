const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      minLength: 2,
    },
    isAvailable: {
      type: Boolean,
      required:true,
    },
    image: {
      type: String,
    },
    vendor: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"vendor"
    }
  },
  {
    timestamps: true,
  }
);  
// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);
const Product = mongoose.model("product", productSchema);
module.exports = Product;
