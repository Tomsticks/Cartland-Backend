const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCart,
  deleteCart,
  cartSummary,
} = require("./cartController");
const { isLogged } = require("../auth/authContoller");
router.post("/addtocart", isLogged, addToCart);
// router.get("/getcart", getCart);
router.get("/mycart", isLogged, getCart);
router.put("/updatecart", updateCart);
router.delete("/deletecart", deleteCart);
module.exports = router;
