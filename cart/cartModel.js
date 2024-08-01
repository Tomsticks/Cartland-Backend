const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
  },
  products: {
    type: Schema.Types.ObjectId,
    ref: "Products",
  },
  totalPrice: {
    type: Number,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

// cartSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "products",
//   });

//   next();
// });
const cart = mongoose.model("Carts", cartSchema);
module.exports = cart;
