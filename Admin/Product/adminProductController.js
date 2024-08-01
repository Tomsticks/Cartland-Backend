const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const products = require("../../products/productModel");
const { v4: uuid } = require("uuid");

exports.createProduct = catchAsync(async (req, res) => {
  let productNum = uuid();
  const product = await products.create({
    productName: req.body.productName,
    availability: req.body.availability,
    brand: req.body.brand,
    category: req.body.category,
    productPrice: req.body.productPrice,
    discountPrice: req.body.discountPrice,
    productImage: req.body.productImage,
    productDescription: req.body.productDescription,
    productRating: req.body.productRating,
    productNumber: productNum,
    productSize: req.body.productSize,
    productQuantity: req.body.productQuantity,
  });
  res.status(201).json({
    status: "Product created sucessfully",
  });
});
