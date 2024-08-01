const express = require("express");
const router = express.Router();
const {
  loginUsers,
  registerUsers,
  forgotPassword,
  resetPassword,
  updateUserPassword,
  isLogged,
} = require("./auth/authContoller");

router.post("/register", registerUsers);
router.post("/login", loginUsers);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);
router.patch("/updateuserpassword", isLogged, updateUserPassword);
module.exports = router;
