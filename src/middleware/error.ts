import { ErrorResponse } from "../utils/errorResponse";
import { NextFunction, Request, Response } from "express";

const defaultErrorHandler = (
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

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val: any) => val.message)[0];
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error (middleware/error.js)",
  });
};

export default defaultErrorHandler;
