// Library
import crypto from "crypto";
import errorHandler from "../middleware/error.js";
// Models
import User from "../models/User.js";
// Utilities
import ErrorResponse from "../utils/errorResponse.js";
import sendEmail from "../utils/sendEmail.js";

/**
 * Allows for a User to be registered with the server
 * @param {object} req Object for the HTTP request received
 * @param {object} res Object for the HTTP response to be sent
 * @param {*} next Control passing
 */
export const register = async (req, res, next) => {
  // Destructing request body
  const { name, email, password } = req.body;

  // Attain request location
  var location = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Attempt a User create with Mongoose
  try {
    const user = await User.create({
      name,
      email,
      password,
      location,
    });
    // Respond with a valid token
    sendToken(user, 201, res);
  } catch (error) {
    // Duplicate key error
    if (error.code === 11000)
      next(new ErrorResponse("User already exists!", 409));

    // All other errors
    next(error);
  }
};

/**
 * Allows for a User to login with the server
 * @param {object} req Object for the HTTP request received
 * @param {object} res Object for the HTTP response to be sent
 * @param {*} next Control passing
 */
export const login = async (req, res, next) => {
  // Destructing request body
  const { email, password } = req.body;

  try {
    // Check that request body is valid
    if (!email || !password)
      throw ["Please provide an email and password", 400];
    // Query the database for a User with the given email
    const user = await User.findOne({ email }).select("+password");

    // If a User does not exist respond with an error
    if (!user) throw ["Invalid credentials", 401];

    // Check if the User provided password matches the database
    const isMatch = await user.matchPasswords(password);

    // If the passwords do not match return
    if (!isMatch) throw ["Invalid credentials", 401];

    sendToken(user, 200, res);
  } catch (error) {
    next(new ErrorResponse(...error));
  }
};

/**
 * Handle a request for a new password by sending and email to
 * the provided email address.
 * @param {object} req Object for the HTTP request received
 * @param {object} res Object for the HTTP response to be sent
 * @param {*} next Control passing
 */
export const forgotpassword = async (req, res, next) => {
  // Destructuring request body
  const { email } = req.body;

  try {
    // Check that the request body is valid
    if (!email) throw ["Please provide an email", 400];

    // Query the database for a User with the given email
    const user = await User.findOne({ email });

    // If a User does not exist respond with an error
    if (!user) throw ["Email could not be sent", 404];

    // Generate a reset password token
    const resetToken = user.getResetPasswordToken();

    // Set the token with the User for usage
    await user.save();

    // Set the reset URL the User can go to
    const resetUrl = `${process.env.HOST}/passwordreset/${resetToken}`;

    // Message to be sent in the email
    const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;

    try {
      // Send an email to the provided account with the given message
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      // Respond with a success message
      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      throw ["Email could not be sent", 500];
    }
  } catch (error) {
    next(new ErrorResponse(...error));
  }
};

export const resetpassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Reset Successful",
    });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};
