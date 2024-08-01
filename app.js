const express = require("express");
const app = express();
const authRouter = require("./router");
const usersRouter = require("./users/router");
const adminProductRouter = require("./Admin/Product/router");
const productRouter = require("./products/router");
const cartRouter = require("./cart/router");
const orderRouter = require("./orders/router");
const paymentRouter = require("./payment/router");
const bodyParser = require("body-parser");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./utils/errorController");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const morgan = require("morgan");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
  })
);
app.use(morgan("tiny"));

const limiter = rateLimit({
  limit: 500,
  windowMs: 1000 * 60 * 60,
  message: "too many requests",
  validate: { xForwardedForHeader: false },
});
app.use("/api/login", limiter);
// TEST SERVER
app.get("/", (req, res) => {
  res.send("welcome to a fresh server");
});
// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminProductRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRouter);

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// ERRROR HANDLING MIDDLEWARE
app.all("*", (req, res, next) => {
  next(new AppError(`invalid ${req.originalUrl}`, 404));
});

// console.log(process.env);
app.use(globalErrorHandler);

module.exports = app;
