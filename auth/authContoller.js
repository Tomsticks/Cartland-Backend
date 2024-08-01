const catchAsync = require("../utils/catchAsync");
const users = require("../users/userModel");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const crypto = require("node:crypto");
const sendEmail = require("../utils/email");
const bcrypt = require("bcryptjs");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWTSECRET, {
    expiresIn: process.env.JWTEXPIRES,
  });
};

const SuccessWithToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWTCOOKIEEXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  user.password = undefined;
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({ data: user, token, status: "success" });
};

exports.registerUsers = catchAsync(async (req, res, next) => {
  let user = await users.create({
    name: req.body.name,
    username: req.body.name,
    email: req.body.email,
    image: req.body.image,
    role: req.body.role,
    password: req.body.password,
  });
  SuccessWithToken(user, 200, res);
});

exports.loginUsers = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email, password);

  if (!email || !password) {
    return res.status(400).json({ message: "Provide Email And Password" });
  }

  const user = await users.findOne({ email }).select("+password");
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!user || !checkPassword) {
    return res
      .status(401)
      .json({ message: "incorrect email or password", statusCode: 400 });
  }

  SuccessWithToken(user, 200, res);
});

exports.isLogged = catchAsync(async (req, res, next) => {
  // req.header.token
  if (req.cookies.jwt) {
    const decoode = await jwt.verify(req.cookies.jwt, process.env.JWTSECRET);
    let currentUser = await users.findById(decoode.id);
    if (!currentUser) {
      return next(
        res.status(401).json({ message: "You are currently not logged in" })
      );
    }

    req.user = currentUser;
  }

  next();
});
exports.account = catchAsync(async (req, res) => {
  const user = await users.findById(req.user);
  const token = req.cookies.jwt;
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWTCOOKIEEXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  res.status(200).json({ user, token });
});

exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res
          .status(403)
          .json({ message: "you dont have permision to this route" })
      );
    }

    next();
  };
};
exports.logOut = catchAsync(async (req, res) => {
  res.clearCookie("jwt", "logout", {
    httpOnly: true,
  });
  // req.cookies.jwt = null;
  res.status(200).json({ message: "logged out successfully" });
});

exports.forgotPassword = async (req, res) => {
  const user = await users.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "no user found" });
  }
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const ResetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v5/auth/resetpassword/${resetToken}`;
  const message = `forgot your password ? send a patch request with your new password and passwordConfirm to:  ${ResetUrl} , ignore if you didnt forget your password`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset; It expires in 10min",
      message: message,
    });
    res.status(200).json({ message: "sucessfuly sent email" });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(400).json({ message: "error sending email", error });
  }
};

// RESET PASSWORD

exports.resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await users.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "invalid or expired token" });
  }

  try {
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    SuccessWithToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserPassword = async (req, res) => {
  const user = await users.findById(req.user.id).select("+password");
  const check = await user.comparePassword(
    req.body.passwordCurrent,
    user.password
  );
  if (!check) {
    return res.status(401).json({ message: "incorrect password" });
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  SuccessWithToken(user, 200, res);
};
