"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorResponse_1 = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    // 11000 is the duplicate error key from Mongoose
    if (err.code === 11000) {
        const message = `Duplicate Field Value Entered`;
        error = new errorResponse_1.ErrorResponse(message, 400);
    }
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message)[0];
        error = new errorResponse_1.ErrorResponse(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error (middleware/error.js)",
    });
};
exports.default = errorHandler;
