const express = require("express");
const router = express.Router();
const {
  getAllProduct,
  getProductById,
  getProductWithProductNumber,
} = require("./productControll");

router.get("/allproducts", getAllProduct);
router.get("/productbyid/:id", getProductById);
router.get("/productbynumber/:productNumber", getProductWithProductNumber);

module.exports = router;
