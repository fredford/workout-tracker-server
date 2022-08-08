// Library
import crypto from "crypto";
import errorHandler from "../middleware/error";
// Models
import {User, UserDocument} from "../models/User";
// Utilities
import {ErrorResponse} from "../utils/errorResponse";
import sendEmail from "../utils/sendEmail";
import {NextFunction, Request, Response} from "express";

/**
 * Allows for a User to be registered with the server
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  // Destructing request body
  const {name, email, password} = req.body;

  // Attain request location
  const location = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

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
  } catch (error: any) {
    // Duplicate key error
    if (error?.code === 11000)
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
export const login = async (req: Request, res: Response, next: NextFunction) => {
  // Destructing request body
  const {email, password} = req.body;

  try {
    // Check that request body is valid
    if (!email || !password)
      throw ["Please provide an email and password", 400];
    // Query the database for a User with the given email
    const user = await User.findOne({email}).select("+password");

    // If a User does not exist respond with an error
    if (!user) throw ["Invalid credentials", 404];

    // Check if the User provided password matches the database
    const isMatch = user.matchPasswords(password);

    // If the passwords do not match return
    if (!isMatch) throw ["Invalid credentials", 401];

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle a request for sending a reset token and URL by email to
 * the provided email address.
 * @param {object} req Object for the HTTP request received
 * @param {object} res Object for the HTTP response to be sent
 * @param {*} next Control passing
 */
export const forgotpassword = async (req: Request, res: Response, next: NextFunction) => {
  // Destructuring request body
  const {email} = req.body;

  try {
    // Check that the request body is valid
    if (!email) throw ["Please provide an email", 400];

    // Query the database for a User with the given email
    const user = await User.findOne({email});

    // If a User does not exist respond with an error
    if (!user) throw ["Email could not be sent", 404];

    // Generate a reset password token
    const resetToken = user.getResetPasswordToken();

    // Set the token with the User for usage
    await user.save();

    // Set the reset URL the User can go to
    const resetUrl = `${process.env.HOST}/resetpassword/${resetToken}`;

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
      res.status(200).json({success: true, data: "Email Sent"});
    } catch (error) {
      user.resetPasswordToken = "";
      user.resetPasswordExpire = new Date();

      await user.save();

      throw ["Email could not be sent", 500];
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Handle a request for updating a new password when given a reset token
 * @param {object} req Object for the HTTP request received
 * @param {object} res Object for the HTTP response to be sent
 * @param {*} next Control passing
 */
export const resetpassword = async (req: Request, res: Response, next: NextFunction) => {
  // Process the reset token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    // Throw an error if no reset token is provided
    if (!resetPasswordToken) throw ["Missing reset token", 400];

    // Find the User matching the password valid reset token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    // Invalid reset token
    if (!user) throw ["Invalid reset token provided", 401];

    user.password = req.body.password;
    user.resetPasswordToken = "";
    user.resetPasswordExpire = new Date();

    // Update the user with the new password and removing reset token
    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Reset Successful",
    });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user: UserDocument, statusCode: number, res: Response) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({success: true, token});
};
