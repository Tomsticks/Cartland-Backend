const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const products = require("./productModel");

exports.getAllProduct = catchAsync(async (req, res) => {
  const data = await products.find(req.query);
  res.status(200).json({
    status: "success",
    data,
  });
});
exports.getProductById = catchAsync(async (req, res, next) => {
  const data = await products.findById(req.params.id);
  if (!data) {
    return next(new AppError("No product found with that product number", 404));
  }
  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getProductWithProductNumber = catchAsync(async (req, res, next) => {
  const data = await products.find({ productNumber: req.params.productNumber });
  if (!data) {
    return next(new AppError("No product found with that product number", 404));
  }
  res.status(200).json({
    status: "success",
    data,
  });
});
