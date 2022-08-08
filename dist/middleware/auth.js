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
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const errorResponse_1 = require("../utils/errorResponse");
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token;
    // Bearer is added to know that it is an authentication token
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        // Ex. "Bearer fa7sd8f7a9sdf7a9s"
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new errorResponse_1.ErrorResponse("Not authorized to access this route, missing token", 401));
    }
    try {
        // Use JSON web token to verify that the token is valid
        const { _id } = jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "");
        const user = yield User_1.default.findById(_id);
        // Check if the received User exists
        if (user) {
            throw new errorResponse_1.ErrorResponse("User not found", 404);
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new errorResponse_1.ErrorResponse(`Not authorized to access this route, ${error}`, 401));
    }
});
exports.protect = protect;
