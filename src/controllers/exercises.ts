import Exercise, { ExerciseDocument } from "../models/Exercise";
import { User, UserDocument } from "../models/User";
import { ErrorResponse } from "../utils/errorResponse";
import { NextFunction, Request, Response } from "express";

import errorHandler from "../middleware/ErrorHandler";

/**
 * Request controller that handles finding and returning Exercise Documents.
 * If 'id' is used as a query parameter with an ExerciseId then a specific
 * Exercise Document will be found, otherwise all User and Admin exercises
 * will be returned.
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const getExercises = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get User Document from Protected Request
    const user: UserDocument = req.user;

    const query = [user, process.env.ADMIN_ID];

    // Searching for an Exercise by Id
    if (req.query.id) {
      const queryId = errorHandler.checkQueryId([
        "Exercise ID",
        req.query.id as string,
      ]);
      // Query database for exercise ID provided
      const exercise = (await Exercise.findOne({
        _id: queryId,
      }).populate("user")) as ExerciseDocument;

      // Check if an Exercise Document is returned
      errorHandler.checkVariables({ exercise }, "NotFound");
      // Check that correct Exercise Document is returned
      errorHandler.checkValidQuery(exercise, queryId);
      // Check if the User has access to the Exercise Document
      errorHandler.checkDocumentAccess(exercise, user);

      // Respond with the exercise found
      res.status(200).json({ success: true, data: exercise });
    }
    // Searching for all Exercises
    else {
      const exercises = await Exercise.find({
        user: { $in: query },
      }).sort({ name: 1 });
      res.status(200).json({ success: true, data: exercises });
    }
  } catch (error: any) {
    if (!error.statusCode) console.log(`Get Exercises ${error}`);
    next(error);
  }
};

/**
 * Request controller that handles adding an Exercise Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const addExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get User Document from Protected Request
    const user: UserDocument = req.user;

    // Get data from the request body
    const { name, area, type } = req.body;

    // Check the request body for missing parameters
    errorHandler.checkVariables({ name, area, type }, "PleaseProvide");

    // Create Exercise Document
    const exercise = await Exercise.create({
      name,
      area,
      type,
      user,
      isAdmin: user._id === process.env.ADMIN_ID,
    });

    // Respond with success and the created Exercise Document
    res.status(201).json({ success: true, data: exercise });
  } catch (error: any) {
    if (!error.statusCode) console.log(`Add Exercises ${error}`);
    next(error);
  }
};

/**
 * Request controller that handles finding and deleting an Exercise Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const deleteExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get User Document from Protected Request
    const user: UserDocument = req.user;

    // Check that the exercise ID is a valid ObjectId
    const exerciseId = errorHandler.checkQueryId([
      "Exercise ID",
      req.query.id as string,
    ]);

    // Query for the Exercise Document of the ExerciseId provided
    const exercise = (await Exercise.findById(exerciseId).populate(
      "user"
    )) as ExerciseDocument;

    // Check that the correct Exercise Document is found
    errorHandler.checkValidQuery(exercise, exerciseId);

    // Check if the User associated to the Exercise is the same as the requesting User
    if (exercise.user._id.toString() === user._id.toString()) {
      exercise.deleteOne();
    } else {
      throw new ErrorResponse("User cannot delete exercise", 403);
    }

    // Respond with success and a success message
    res.status(200).json({ success: true, data: "Success" });
  } catch (error: any) {
    if (!error.statusCode) console.log(`Delete Exercises ${error}`);
    next(error);
  }
};
