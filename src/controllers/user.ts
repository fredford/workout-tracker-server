// Libraries
import { NextFunction, Request, Response } from "express";
// Models
import { UserDocument } from "../models/User";
// Utilities
import { ErrorResponse } from "../utils/errorResponse";
import { getUserFromReq } from "../utils/utils";

/**
 * Request controller that handles finding and returning a User Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the User Document from the request token
    const user: UserDocument = await getUserFromReq(req);

    // Return the User if found
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    if (!error.statusCode) console.log(`Get User - ${error}`);
    next(error);
  }
};

/**
 * Request controller that handles updating a User Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the User Document from the request token
    const user: UserDocument = await getUserFromReq(req);

    // JSON information for User updates
    if (Object.keys(req.body).length === 0) {
      throw new ErrorResponse("Request body not provided", 400);
    }

    // Update name of the User
    if (req.body.name && req.body.name.length > 3) {
      user.name = req.body.name;
    } else if (req.body.name) {
      throw new ErrorResponse("Invalid name provided", 400);
    }

    // Update password of the User
    if (req.body.password && req.body.password.length > 5) {
      user.password = req.body.password;
    } else if (req.body.password) {
      throw new ErrorResponse("Invalid password provided", 400);
    }

    // Update theme of the User
    if (
      req.body.theme &&
      (req.body.theme === "light" || req.body.theme === "dark")
    ) {
      user.theme = req.body.theme;
    } else {
      throw new ErrorResponse("Invalid theme provided", 400);
    }
    // Save updates with Mongoose
    await user.save();
    // Respond with the updated User document
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        theme: user.theme,
      },
    });
  } catch (error: any) {
    if (!error.statusCode) console.log(`Update User - ${error}`);
    next(error);
  }
};

/**
 * Request controller that handles finding and deleting a User Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the User Document from the request token
    const user: UserDocument = await getUserFromReq(req);
    // Delete User Document from the database
    user.deleteOne();
    // Respond success status of the request
    res.status(200).json({
      success: true,
      data: "Success",
    });
  } catch (error) {
    next(error);
  }
};
