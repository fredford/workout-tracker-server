import Workout from "../models/Workout";
import { UserDocument } from "../models/User";
import Set from "../models/Set";
import { NextFunction, Request, Response } from "express";

import errorHandler from "../middleware/ErrorHandler";

/**
 * File contains extra request handling functionality for workouts.
 */

/**
 * Request handler to find the last workout started by the user
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const lastWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the User Document from the Protected Request
    const user: UserDocument = req.user;
    // Query database for exercise ID provided
    const workout = (
      await Workout.find({ user: user._id })
        .populate("user")
        .sort({ date: -1 })
        .limit(1)
    )[0];

    // Check if a Document is returned
    errorHandler.checkVariables({ workout }, "NotFound");
    // Check that the Document is accessible to the User
    errorHandler.checkDocumentAccess(workout, user);
    // Get the list of sets for this workout
    const sets = await Set.find({ workout: workout._id });
    // Compute the number of sets performed
    const setsCount = sets.length;
    // Calculate the total number of repetitions performed
    const totalReps = sets.reduce((sum, curr) => sum + Number(curr.amount), 0);
    // Respond with the last workout ID, type and stats information
    res.status(200).json({
      success: true,
      data: {
        id: workout._id,
        type: workout.type,
        sets: setsCount,
        totalRepetitions: totalReps,
      },
    });
  } catch (error: any) {
    if (!error.statusCode) console.log(`Last workout ${error}`);
    next(error);
  }
};
