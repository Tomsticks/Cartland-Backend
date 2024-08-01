const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const axios = require("axios");
const order = require("../orders/orderModel");
const { v4: uuid } = require("uuid");
const paymentRef = uuid();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
exports.initializeTransaction = catchAsync(async (req, res) => {
  const { orderid } = req.params;
  if (!orderid) {
    return next(new AppError("Invalid order id", 400));
  }
  const orderInfo = await order.findOne({
    _id: orderid,
  });
  console.log(orderInfo.email, orderInfo.orderTotal);
  const url = `https://api.paystack.co/transaction/initialize`;
  try {
    const response = await axios.post(
      url,
      {
        amount: orderInfo.orderTotal * 100,
        email: orderInfo.email,
        callback_url: "https://api.paystack.co/transaction/verify/",
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    res.status(200).json(response.data);
    const updatePaymentStat = await order.findByIdAndUpdate(orderid, {
      paymentRef: response.data.data.reference,
      paymentStatus: "pending",
    });
  } catch (error) {
    res.send(error);
  }
});

exports.verifyTransaction = catchAsync(async (req, res) => {
  const { reference } = req.params;

  const url = `https://api.paystack.co/transaction/verify/${reference}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });
    res.status(200).json(response.data);
    const updatePaymentStat = await order.findOneAndUpdate(
      { paymentRef: reference },
      {
        paymentStatus: response.data.data.status,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

exports.getAllTransactions = catchAsync(async (req, res) => {
  const url = `https://api.paystack.co/transaction`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.send(error);
  }
});

exports.getTransactionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const url = `https://api.paystack.co/transaction/${id}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.send(error);
  }
});
