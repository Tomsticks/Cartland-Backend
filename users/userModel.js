const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("node:crypto");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is Required"],
  },
  firstname: {
    type: String,
    defualt: "",
  },
  lastname: {
    type: String,
    defualt: "",
  },
  birthday: {
    type: Date,
    defualt: new Date(),
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    defualt: "",
  },
  username: {
    type: String,
    required: [true, "Username is Required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is Required"],
    unique: [true, "email is in use"],
    lowercase: true,
    validate: [validator.isEmail, "please Provide a valid Email"],
  },
  image: String,

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Provide a Password"],
    minlength: [8, "password must be more than 8 characters"],
    select: false,
  },
  phoneNumber: {
    type: Number,
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
// userSchema.methods.comparePassword = async function (bodyPasword, dbPassword) {
//   return await bcrypt.compare(bodyPasword, dbPassword);
// };

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.passwordChange = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const user = mongoose.model("Users", userSchema);
module.exports = user;
