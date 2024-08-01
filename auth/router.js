const express = require("express");
const router = express.Router();
const {
  loginUsers,
  registerUsers,
  forgotPassword,
  resetPassword,
  updateUserPassword,
  isLogged,
  logOut,
} = require("./authContoller");

router.post("/register", registerUsers);
router.post("/login", loginUsers);
router.get("/logout", isLogged, logOut);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);
router.patch("/updateuserpassword", isLogged, updateUserPassword);
module.exports = router;
