const errProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};
const errDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
  // console.log(err);
};

function globalErrorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `${errors.join(". ")}`;
    return res.status(401).json({ message: message });
  } else if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    return res.status(400).json({ message: message });
  } else if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `Duplicate Field Value ${value} please use another value`;
    return res.status(400).json({ message: message });
  }

  if (process.env.NODE_ENV === "production") {
    errProd(err, res);
  }
  if (process.env.NODE_ENV === "development") {
    errDev(err, res);
  }
}

module.exports = globalErrorHandler;
