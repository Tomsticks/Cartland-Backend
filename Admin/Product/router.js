const express = require("express");
const router = express.Router();
const { createProduct } = require("../Product/adminProductController");
router.post("/createproduct", createProduct);

module.exports = router;
