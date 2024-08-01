const user = require("./userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// To allow a certain field to be accepted
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUser = catchAsync(async (req, res) => {
  const users = await user.find();
  if (!users) {
    res.status(404).json({ message: "no user found" });
  }
  res
    .status(200)
    .json({ message: "sucess", data: users, total: user.countDocuments });
});

exports.updateUserData = async (req, res, next) => {
  // CHECK FOR PASSWORD DATA
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "this route is not to update password, use/updatepassword",
        400
      )
    );
  }

  // const filteredBody = filterObj(req.body, "name", "email");
  const filteredBody = filterObj(req.body, "firstname", "lastname", "birthday");
  const updateUser = await user.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ message: "sucess", user: updateUser });
};

exports.deleteUser = catchAsync(async (req, res) => {
  await user.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({ message: "sucess", data: null });
});
