import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Workout from "./Workout.js";
import Set from "./Set.js";
import Exercise from "./Exercise.js";

// Model Schema for Users
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  theme: {
    type: String,
    default: "light",
    enum: ["light", "dark"],
  },
  location: {
    type: String,
    required: [true, "No location provided"],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.pre("deleteOne", { document: true }, function (next) {
  Set.deleteMany({ user: { _id: this._id } })
    .then(function () {})
    .catch(function (error) {
      console.log(error);
    });

  Workout.deleteMany({ user: { _id: this._id } })
    .then(function () {})
    .catch(function (error) {
      console.log(error);
    });

  Exercise.deleteMany({ user: { _id: this._id } })
    .then(function () {})
    .catch(function (error) {
      console.log(error);
    });

  next();
});

UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRE}`,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 60 * (60 * 1000);

  return resetToken;
};

const User = mongoose.model("User", UserSchema);

export default User;
