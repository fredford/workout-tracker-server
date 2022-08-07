// Libraries
import {NextFunction, Request, Response} from "express";
// Models
import Exercise from "../models/Exercise";
import Set from "../models/Set.js";
import {UserDocument} from "../models/User";
import Workout from "../models/Workout.js";
// Utilities
import { ErrorResponse } from "../utils/errorResponse"
import {getUserFromReq} from "../utils/utils";

/**
 * Request controller that handles adding a Set Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const addSet = async (req: Request, res: Response, next: NextFunction) => {

  try {
    // Get the User Document from the request token
    const user: UserDocument = await getUserFromReq(req);

    // Get the request body information
    const { date, exerciseId, workoutId, amount } = req.body

    // Query for the provided Exercise and Workout
    const exercise = await Exercise.findById(exerciseId);
    const workout = await Workout.findById(workoutId);

    // Check if an Exercise or Workout were received
    if (!exercise || !workout) {
      next( new ErrorResponse("Exercise or workout do not exist!", 404))
    }

    // Create the Set with Mongoose
    const set = await Set.create({
      date,
      exercise,
      workout,
      amount,
      user,
    });

    // Respond with the Set created and 201 status
    res.status(201).json({ success: true, data: set });
  } catch (error) {
    next(error);
  }
};

export const deleteSet = async (req: Request, res: Response, next: NextFunction) => {

  const { setId } = req.params;

  try {
    // Get the User Document from the request token
    const user: UserDocument = await getUserFromReq(req);


    const set = await Set.findById(setId);

    if (!set) {
      next(new ErrorResponse("Set does not exist!", 400));
    }

    const response = await Set.deleteOne({
      _id: set.id,
    });

    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
