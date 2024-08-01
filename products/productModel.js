const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: {
    type: String,
    required: [true, "Name is Required"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters long."],
    maxlength: [50, "Name must be at most 50 characters long."],
    // unique:[true, 'Product already']
  },
  availability: {
    type: String,
    required: [true, "Availability is Required"],
    lowercase: true,
  },
  brand: {
    type: String,
    lowercase: true,
  },
  category: {
    type: String,
    required: [true, "category is Required"],
    lowercase: true,
  },
  productPrice: {
    type: Number,
    required: [true, "Price is Required"],
  },
  discountPrice: {
    type: Number,
  },
  productImage: {
    type: String,
    required: [true, "Image is Required"],
  },
  productDescription: {
    type: String,
    required: [true, "Description is Required"],
  },
  productRating: {
    type: Number,
  },
  productNumber: {
    type: String,
  },
  productSize: {
    type: String,
    lowercase: true,
  },
  productQuantity: {
    type: Number,
    default: 1,
  },
});

const products = mongoose.model("Products", productSchema);
module.exports = products;
