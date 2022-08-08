import mongoose, {Types} from "mongoose";


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Workout from "./Workout";
import Set from "./Set";
import Exercise from "./Exercise";

export type UserDocument = mongoose.Document & {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  theme: string;
  location: string;
  resetPasswordToken: string;
  resetPasswordExpire: Date;

  matchPasswords: (password: string) => boolean;
  getSignedToken: () => string;
  getResetPasswordToken: () => string;
}


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

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.pre("deleteOne", function deleteOne(this: UserDocument, next) {

  const user = this;

  Set.deleteMany({user: {_id: this._id}})
    .then(() => {
      console.log("Done")
    })
    .catch((error: Promise<void>) => {
      console.log(error);
    });

  Workout.deleteMany({user: {_id: this._id}})
    .then(() => {
      console.log("Done")
    })
    .catch((error: Promise<void>) => {
      console.log(error);
    });

  Exercise.deleteMany({user: {_id: this._id}})
    .then(() => {
      console.log("Done")
    })
    .catch((error: Promise<void>) => {
      console.log(error);
    });

  next();
});

UserSchema.methods.matchPasswords = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({id: this.id}, process.env.JWT_SECRET ?? "", {
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

export const User = mongoose.model<UserDocument>("User", UserSchema);
