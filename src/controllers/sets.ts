// Libraries
import { NextFunction, Request, Response } from "express";
// Models
import Exercise from "../models/Exercise";
import SetModel from "../models/Set";
import { UserDocument } from "../models/User";
import Workout from "../models/Workout";
// Utilities
import { getUserFromReq } from "../utils/utils";
import errorHandler from "../middleware/ErrorHandler";

/**
 * Request controller that handles adding a Set Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const addSet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the User Document from the request token
    const user: UserDocument = req.user;

    // Get the request body information
    const { date, exerciseId, workoutId, amount } = req.body;

    // Check the request body
    errorHandler.checkVariables(
      { exerciseId, workoutId, amount },
      "PleaseProvide"
    );

    // Query for the provided Exercise and Workout
    const exercise = await Exercise.findById(exerciseId);
    const workout = await Workout.findById(workoutId);

    // Check that results are found
    errorHandler.checkVariables({ exercise }, "NotFound");
    errorHandler.checkVariables({ workout }, "NotFound");
    // Check that the results are valid
    errorHandler.checkValidQuery(exercise, exerciseId);
    errorHandler.checkValidQuery(workout, workoutId);

    // Create the Set with Mongoose
    const set = await SetModel.create({
      date,
      exercise,
      workout,
      amount,
      user,
    });

    // Respond with the Set created and 201 status
    res.status(201).json({ success: true, data: set });
  } catch (error: any) {
    if (!error.statusCode) console.log(`Add Set - ${error.message}`);
    next(error);
  }
};

export const getSets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the Sets for the workout
    const user: UserDocument = req.user;
    // Set the workout ID from query
    const workoutId = req.query.id as string;
    // Check that the workout ID is a valid ObjectId
    errorHandler.checkQueryId(["ID", workoutId]);
    // Query for the Workout passed
    const workout = await Workout.findById(workoutId);
    // Check that the workout exists
    errorHandler.checkVariables({ workout }, "NotFound");
    // Check that the workout was correctly returned
    errorHandler.checkValidQuery(workout, workoutId);
    // Query database for workout ID related Set Documents
    const results = await SetModel.find({
      user: user._id,
      workout: workoutId,
    })
      .populate("workout")
      .populate("exercise");

    res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    if (!error.statusCode) console.log(`Get Sets ${error.message}`);
    next(error);
  }
};
