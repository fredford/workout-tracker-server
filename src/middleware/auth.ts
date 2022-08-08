import jwt, {JwtPayload} from "jsonwebtoken";
import {User, UserDocument} from "../models/User";
import {ErrorResponse} from "../utils/errorResponse"
import {Request, NextFunction, Response} from "express";
import {getUserFromReq} from "../utils/utils";


export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Bearer is added to know that it is an authentication token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Ex. "Bearer fa7sd8f7a9sdf7a9s"
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ErrorResponse(
        "Not authorized to access this route, missing token",
        401
      )
    );
  }

  try {
    req.user = await getUserFromReq(req)

    next();
  } catch (error) {
    return next(
      new ErrorResponse(`Not authorized to access this route, ${error}`, 401)
    );
  }
};
