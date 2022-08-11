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
exports.protect = void 0;
const errorResponse_1 = require("../utils/errorResponse");
const utils_1 = require("../utils/utils");
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        req.user = yield (0, utils_1.getUserFromReq)(req);
        next();
    }
    catch (error) {
        return next(new errorResponse_1.ErrorResponse(`Not authorized to access this route, ${error}`, 401));
    }
});
exports.protect = protect;
