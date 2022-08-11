// Library imports
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
// Utilities
import { ErrorResponse } from "./errorResponse";
import errorHandler from "../middleware/ErrorHandler";
// Mongoose Models
import { User, UserDocument } from "../models/User";

/**
 * Retrieve the User Document for a given authorization token
 * @param {Request} req Object for the HTTP request received
 * @returns UserDocument
 */
export async function getUserFromReq(req: Request) {
  // Check the request headers for the authorization token
  const token = req?.headers?.authorization?.split(" ")[1] ?? "";

  // Check if a token has been provided
  if (!token.length) {
    throw new ErrorResponse("Authentication token not provided", 403);
  }

  // Use JSON web token to verify that the token is valid
  const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as JwtPayload;
  // Find the User
  const user = await User.findById(decoded.id);
  // Check if the received User exists
  errorHandler.checkVariables({ user }, "NotFound");

  return user as UserDocument;
}
