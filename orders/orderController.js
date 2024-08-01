const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const order = require("./orderModel");
const { v4: uuid } = require("uuid");
const cart = require("../cart/cartModel");
const orderId = uuid();

exports.createorder = catchAsync(async (req, res, next) => {
  const cartId = await cart.find({
    userId: req.user._id,
  });
  console.log(cartId);
  if (cartId.length === 0) {
    return next(new AppError("Cart is empty", 404));
  }
  const getOrderPrice = await cart.aggregate([
    {
      $group: {
        _id: req.user._id,
        totalPrice: { $sum: "$totalPrice" },
      },
    },
  ]);
  let orderPrice = getOrderPrice[0].totalPrice;
  const newOrder = await order.create({
    orderID: orderId,
    orderAddress: req.body.orderAddress,
    orderTotal: orderPrice,
    fullname: req.body.fullname,
    email: req.body.email,
    phone: req.body.phone,
    country: req.body.country,
    city: req.body.city,
    state: req.body.state,
    zipCode: req.body.zip,
    user: req.user._id,
    productOrdered: cartId,
    orderDate: Date.now(),
  });
  res.status(200).json({
    status: "success",
    newOrder,
  });
});
exports.getMyOrder = catchAsync(async (req, res) => {
  const myOrder = await order.find({ user: req.user._id });

  res.status(200).json({
    status: "success",
    myOrder,
  });
});
