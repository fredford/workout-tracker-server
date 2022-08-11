// Library imports
import mongoose, { Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// Mongoose Models
import Workout from "./Workout";
import SetModel from "./Set";
import Exercise from "./Exercise";

export type UserDocument = mongoose.Document & {
  _id: Types.ObjectId; // User ID
  name: string; // User name eg. "John Smith"
  email: string; // User email eg. "JohnSmith@mail.com"
  password: string; // User password SHA256 hashed
  theme: string; // User theme eg. "light"
  location: string; // User location eg. "8.8.8.8"
  resetPasswordToken: string; // User reset password token
  resetPasswordExpire: Date; // User reset password expiry date

  matchPasswords: (password: string) => boolean;
  getSignedToken: () => string;
  getResetPasswordToken: () => string;
};

// Model Schema for Users
const UserSchema = new mongoose.Schema<UserDocument>({
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

// On-save function updating the password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  // Add salt to the hash
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// When deleteONe is called remove all associated Sets, Workouts, Exercises
UserSchema.pre("deleteOne", function deleteOne(this: UserDocument, next) {
  SetModel.deleteMany({ user: { _id: this._id } })
    .then(() => {
      console.log("Done");
    })
    .catch((error: Promise<void>) => {
      console.log(error);
    });

  Workout.deleteMany({ user: { _id: this._id } })
    .then(() => {
      console.log("Done");
    })
    .catch((error: Promise<void>) => {
      console.log(error);
    });

  Exercise.deleteMany({ user: { _id: this._id } })
    .then(() => {
      console.log("Done");
    })
    .catch((error: Promise<void>) => {
      console.log(error);
    });

  next();
});

// Method to check if the provided password matches the stored password
UserSchema.methods.matchPasswords = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};
// Retrieve a signed token from the JSON Web Token
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET ?? "", {
    expiresIn: `${process.env.JWT_EXPIRE}`,
  });
};
// Retrieve a token for resetting the user password
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Set a time for when the reset token expires
  this.resetPasswordExpire = Date.now() + 60 * (60 * 1000);
  return resetToken;
};

export const User = mongoose.model<UserDocument>("User", UserSchema);
