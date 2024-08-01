const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const cart = require("./cartModel");
const productsModel = require("../products/productModel");
exports.addToCart = catchAsync(async (req, res, next) => {
  const { products, quantity } = req.body;
  //   check if the product exist in the cart before
  const product = await productsModel
    .find({
      _id: { $in: products },
    })
    .select("productPrice");
  const productPrice = product[0];
  // console.log(productPrice.productPrice);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const cartItem = await cart.findOne({
    userId: req.user.id,
    products: products,
  });
  //   then maybe the user wants to adjust the quatity
  if (cartItem) {
    next(new AppError("item has been added to cart already", 401));
  } else {
    const newCartItem = await cart.create({
      userId: req.user._id,
      products: products,
      totalPrice: productPrice.productPrice * quantity,
      quantity,
    });
    await newCartItem.save();
    res.status(200).json({
      status: "success",
      data: newCartItem,
    });
  }
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cartItems = await cart
    .find({ userId: req.user._id })
    .populate("products");

  if (!cartItems || cartItems.length === 0) {
    next(new AppError("Cart is empty", 404));
  }
  const getCartPrice = await cart.aggregate([
    {
      $match: { userId: req.user._id },
    },
    {
      $group: {
        _id: null,
        totalPrice: { $sum: "$totalPrice" },
      },
    },
  ]);

  let price = getCartPrice[0].totalPrice;

  res.status(200).json({
    status: "success",
    data: cartItems,
    summaryPrice: price,
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const cartItem = await cart.findOne({
    userId: req.user._id,
    productId: productId,
  });
  if (cartItem) {
    cartItem.quantity = quantity;
    await cartItem.save();
  } else {
    const newCartItem = await cart.create({
      userId: req.user._id,
      productId: productId,
      quantity,
    });
    await newCartItem.save();
    res.status(200).json({
      status: "success",
      data: newCartItem,
    });
  }
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const cartItem = await cart.findOneAndDelete({
    userId: req.user._id,
    productId: productId,
  });
  res.status(200).json({
    status: "success",
    data: cartItem,
  });
});
