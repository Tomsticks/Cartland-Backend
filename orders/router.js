const express = require("express");
const router = express.Router();
const { createorder, getMyOrder } = require("./orderController");
const { isLogged } = require("../auth/authContoller");

router.post("/createorder", isLogged, createorder);
router.get("/getmyorder", isLogged, getMyOrder);

module.exports = router;
