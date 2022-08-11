// Library imports
import { NextFunction, Request, Response } from "express";
// Utilities
import { ErrorResponse } from "../utils/errorResponse";

/**
 * Default error handler for handling the transmission of error responses
 * from the server.
 */
const ErrorTransmission = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };

  error.message = err.message;

  // 11000 is the duplicate error key from Mongoose
  if (err.code === 11000) {
    const message = `Duplicate Field Value Entered`;
    error = new ErrorResponse(message, 400);
  }
  // Error handling for Mongoose errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val: any) => val.message)[0];
    error = new ErrorResponse(message, 400);
  }

  // Respond with the specified error code and message, or
  // return a server error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error (middleware/error.js)",
  });
};

export default ErrorTransmission;
