// Library imports
import { Request, NextFunction, Response } from "express";
// Utilities
import { ErrorResponse } from "../utils/errorResponse";
import { getUserFromReq } from "../utils/utils";

/**
 * Callback function for protecting endpoints in the server,
 * by verifying a request User token and adding the validiated
 * user information to the request.
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 * @returns
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  // Bearer is added to know that it is an authentication token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Ex. "Bearer fa7sd8f7a9sdf7a9s"
    token = req.headers.authorization.split(" ")[1];
  }
  // If no token is provided throw an error
  if (!token) {
    return next(
      new ErrorResponse(
        "Not authorized to access this route, missing token",
        401
      )
    );
  }
  // Get the User object and add to the request
  try {
    req.user = await getUserFromReq(req);
    next();
  } catch (error) {
    return next(
      new ErrorResponse(`Not authorized to access this route, ${error}`, 401)
    );
  }
};
