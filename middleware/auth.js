import jwt from "jsonwebtoken";
import User from "../models/User.ts";
import ErrorResponse from "../utils/errorResponse.ts";

export const protect = async (req, res, next) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("No user found with this id", 404));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(
      new ErrorResponse(`Not authorized to access this route, ${error}`, 401)
    );
  }
};
