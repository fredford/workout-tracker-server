// Libraries
import {NextFunction, Request, Response} from "express"
// Models
import {UserDocument} from "../models/User";
// Utilities
import { ErrorResponse } from "../utils/errorResponse"
import {getUserFromReq} from "../utils/utils";

/**
 * Request controller that handles finding and returning a User Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the User Document from the request token
    const user: UserDocument = await getUserFromReq(req);

    // Return the User if found
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request controller that handles updating a User Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the User Document from the request token
    const user: UserDocument = await getUserFromReq(req)

    // JSON information for User updates
    const updatedUser = req.body ?
        req.body :
        next(new ErrorResponse("Request body not provided", 400));

    // Update name of the User
    if (updatedUser.name && updatedUser.name.length > 0) {
      user.name = updatedUser.name;
    } else {
      next( new ErrorResponse("Invalid name provided", 400))
    }

    // Update password of the User
    if (updatedUser.password && updatedUser.password.length > 5) {
      user.password = updatedUser.password;
    }else {
      next( new ErrorResponse("Invalid password provided", 400))
    }

    // Update theme of the User
    if (updatedUser.theme && (updatedUser.theme === "light" || updatedUser.theme === "dark")) {
      user.theme = updatedUser.theme;
    } else {
      next( new ErrorResponse("Invalid theme provided", 400))
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
  } catch (error) {
    next(error);
  }
};

/**
 * Request controller that handles finding and deleting a User Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the User Document from the request token
    const user: UserDocument = await getUserFromReq(req)
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
