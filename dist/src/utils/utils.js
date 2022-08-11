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
exports.getUserFromReq = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorResponse_1 = require("./errorResponse");
const User_1 = require("../models/User");
function getUserFromReq(req) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        // Check the request headers for the authorization token
        const token = (_c = (_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]) !== null && _c !== void 0 ? _c : "";
        // Check if a token has been provided
        if (!token.length) {
            throw new errorResponse_1.ErrorResponse("Authentication token not provided", 403);
        }
        // Use JSON web token to verify that the token is valid
        const { _id } = jsonwebtoken_1.default.verify(token, (_d = process.env.JWT_SECRET) !== null && _d !== void 0 ? _d : "");
        const user = yield User_1.User.findById(_id);
        // Check if the received User exists
        if (user) {
            throw new errorResponse_1.ErrorResponse("User not found", 404);
        }
        return user;
    });
}
exports.getUserFromReq = getUserFromReq;
