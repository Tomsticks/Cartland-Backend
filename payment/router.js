const express = require("express");
const router = express.Router();
const {
  initializeTransaction,
  verifyTransaction,
  getAllTransactions,
  getTransactionById,
} = require("./paymentContoller");

router.post("/initialize-transaction/:orderid", initializeTransaction);
router.get("/verify-transaction/:reference", verifyTransaction);
router.get("/get-all-transactions", getAllTransactions);
router.get("/get-transaction/:id", getTransactionById);

module.exports = router;
