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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = void 0;
// Utilities
const errorResponse_1 = require("../utils/errorResponse");
const utils_1 = require("../utils/utils");
/**
 * Request controller that handles finding and returning a User Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the User Document from the request token
        const user = yield (0, utils_1.getUserFromReq)(req);
        // Return the User if found
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
/**
 * Request controller that handles updating a User Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the User Document from the request token
        const user = yield (0, utils_1.getUserFromReq)(req);
        // JSON information for User updates
        const updatedUser = req.body ?
            req.body :
            next(new errorResponse_1.ErrorResponse("Request body not provided", 400));
        // Update name of the User
        if (updatedUser.name && updatedUser.name.length > 0) {
            user.name = updatedUser.name;
        }
        else {
            next(new errorResponse_1.ErrorResponse("Invalid name provided", 400));
        }
        // Update password of the User
        if (updatedUser.password && updatedUser.password.length > 5) {
            user.password = updatedUser.password;
        }
        else {
            next(new errorResponse_1.ErrorResponse("Invalid password provided", 400));
        }
        // Update theme of the User
        if (updatedUser.theme && (updatedUser.theme === "light" || updatedUser.theme === "dark")) {
            user.theme = updatedUser.theme;
        }
        else {
            next(new errorResponse_1.ErrorResponse("Invalid theme provided", 400));
        }
        // Save updates with Mongoose
        yield user.save();
        // Respond with the updated User document
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                theme: user.theme,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
/**
 * Request controller that handles finding and deleting a User Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the User Document from the request token
        const user = yield (0, utils_1.getUserFromReq)(req);
        // Delete User Document from the database
        user.deleteOne();
        // Respond success status of the request
        res.status(200).json({
            success: true,
            data: "Success",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;