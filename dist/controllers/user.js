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
exports.deleteUser = exports.updateUser = exports.getUser = void 0;
const User_ts_1 = __importDefault(require("../models/User.ts"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorResponse_1 = require("../utils/errorResponse");
const utils_1 = require("../utils/utils");
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
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the User Document from the request token
        const user = yield (0, utils_1.getUserFromReq)(req);
        // JSON information for User updates
        const updatedUser = req.body ?
            req.body :
            next(new errorResponse_1.ErrorResponse("Request body not provided", 400));
        if (updatedUser.name && updatedUser.name.length > 0) {
            user.name = updatedUser.name;
        }
        if (updatedUser.password && updatedUser.password.length > 0) {
            user.password = updatedUser.password;
        }
        if (updatedUser.theme && updatedUser.theme.length > 0) {
            user.theme = updatedUser.theme;
        }
        yield user.save();
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
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield User_ts_1.default.findById(decoded.id);
        user.deleteOne();
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
