const express = require("express");
const router = express.Router();
const { getAllUser, updateUserData, deleteUser } = require("./userController");
const { isLogged, restrict, account } = require("../auth/authContoller");

router.get("/allusers", isLogged, restrict("admin"), getAllUser);
router.get("/account", isLogged, account);
router.patch("/updatemydata", isLogged, updateUserData);
router.delete("/deleteme", isLogged, deleteUser);

module.exports = router;
