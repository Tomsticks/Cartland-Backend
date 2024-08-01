const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

// Order information more like informatiions to get from the check out page
const orderSchema = new Schema({
  orderID: {
    type: String,
    required: true,
    // unique: true,
  },
  orderDate: {
    type: Date,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "pending",
  },
  orderTotal: {
    type: Number,
    required: true,
  },
  orderAddress: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  productOrdered: [
    {
      type: Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
  ],
  paymentMethod: {
    type: String,
    default: "payStack",
  },
  paymentRef: {
    type: String,
  },
  paymentStatus: {
    type: String,
  },
  tranxNo: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const order = mongoose.model("Order", orderSchema);
module.exports = order;
