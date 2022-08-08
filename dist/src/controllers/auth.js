"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetpassword = exports.forgotpassword = exports.login = exports.register = void 0;
// Library
const crypto_1 = __importDefault(require("crypto"));
// Models
const User_1 = require("../models/User");
// Utilities
const errorResponse_1 = require("../utils/errorResponse");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
/**
 * Allows for a User to be registered with the server
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructing request body
    const { name, email, password } = req.body;
    // Attain request location
    const location = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // Attempt a User create with Mongoose
    try {
        const user = yield User_1.User.create({
            name,
            email,
            password,
            location,
        });
        // Respond with a valid token
        sendToken(user, 201, res);
    }
    catch (error) {
        // Duplicate key error
        if ((error === null || error === void 0 ? void 0 : error.code) === 11000)
            next(new errorResponse_1.ErrorResponse("User already exists!", 409));
        // All other errors
        next(error);
    }
});
exports.register = register;
/**
 * Allows for a User to login with the server
 * @param {object} req Object for the HTTP request received
 * @param {object} res Object for the HTTP response to be sent
 * @param {*} next Control passing
 */
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructing request body
    const { email, password } = req.body;
    try {
        // Check that request body is valid
        if (!email || !password)
            throw ["Please provide an email and password", 400];
        // Query the database for a User with the given email
        const user = yield User_1.User.findOne({ email }).select("+password");
        // If a User does not exist respond with an error
        if (!user)
            throw ["Invalid credentials", 404];
        // Check if the User provided password matches the database
        const isMatch = user.matchPasswords(password);
        // If the passwords do not match return
        if (!isMatch)
            throw ["Invalid credentials", 401];
        sendToken(user, 200, res);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
/**
 * Handle a request for sending a reset token and URL by email to
 * the provided email address.
 * @param {object} req Object for the HTTP request received
 * @param {object} res Object for the HTTP response to be sent
 * @param {*} next Control passing
 */
const forgotpassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructuring request body
    const { email } = req.body;
    try {
        // Check that the request body is valid
        if (!email)
            throw ["Please provide an email", 400];
        // Query the database for a User with the given email
        const user = yield User_1.User.findOne({ email });
        // If a User does not exist respond with an error
        if (!user)
            throw ["Email could not be sent", 404];
        // Generate a reset password token
        const resetToken = user.getResetPasswordToken();
        // Set the token with the User for usage
        yield user.save();
        // Set the reset URL the User can go to
        const resetUrl = `${process.env.HOST}/resetpassword/${resetToken}`;
        // Message to be sent in the email
        const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;
        try {
            // Send an email to the provided account with the given message
            yield (0, sendEmail_1.default)({
                to: user.email,
                subject: "Password Reset Request",
                text: message,
            });
            // Respond with a success message
            res.status(200).json({ success: true, data: "Email Sent" });
        }
        catch (error) {
            user.resetPasswordToken = "";
            user.resetPasswordExpire = new Date();
            yield user.save();
            throw ["Email could not be sent", 500];
        }
    }
    catch (error) {
        next(error);
    }
});
exports.forgotpassword = forgotpassword;
/**
 * Handle a request for updating a new password when given a reset token
 * @param {object} req Object for the HTTP request received
 * @param {object} res Object for the HTTP response to be sent
 * @param {*} next Control passing
 */
const resetpassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Process the reset token
    const resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");
    try {
        // Throw an error if no reset token is provided
        if (!resetPasswordToken)
            throw ["Missing reset token", 400];
        // Find the User matching the password valid reset token
        const user = yield User_1.User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {
                $gt: Date.now(),
            },
        });
        // Invalid reset token
        if (!user)
            throw ["Invalid reset token provided", 401];
        user.password = req.body.password;
        user.resetPasswordToken = "";
        user.resetPasswordExpire = new Date();
        // Update the user with the new password and removing reset token
        yield user.save();
        res.status(201).json({
            success: true,
            data: "Password Reset Successful",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetpassword = resetpassword;
const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token });
};
