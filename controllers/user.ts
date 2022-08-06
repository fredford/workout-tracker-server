import User from "../models/User.ts";
import jwt from "jsonwebtoken";

import { ErrorResponse } from "../utils/errorResponse"

import {NextFunction, Request, Response} from "express"

export const user = async (req: Request, res: Response, next: NextFunction) => {


  try {

    const token = req?.headers?.authorization?.split(" ")[1] ?? ""

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const updatedUser = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (updatedUser.name && updatedUser.name.length > 0) {
      user.name = updatedUser.name;
    }

    if (updatedUser.password && updatedUser.password.length > 0) {
      user.password = updatedUser.password;
    }

    if (updatedUser.theme && updatedUser.theme.length > 0) {
      user.theme = updatedUser.theme;
    }

    await user.save();

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

export const deleteUser = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    user.deleteOne();

    res.status(200).json({
      success: true,
      data: "Success",
    });
  } catch (error) {
    next(error);
  }
};
