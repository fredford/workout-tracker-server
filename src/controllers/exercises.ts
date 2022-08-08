import jwt from "jsonwebtoken";

import Exercise, {ExerciseDocument} from "../models/Exercise";
import {User, UserDocument} from "../models/User";
import {ErrorResponse} from "../utils/errorResponse"
import {NextFunction, Request, Response} from "express";
import {getUserFromReq} from "../utils/utils";

/**
 * Request controller that handles finding and returning Exercise Documents.
 * If 'id' is used as a query parameter with an ExerciseId then a specific
 * Exercise Document will be found, otherwise all User and Admin exercises
 * will be returned.
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const getExercises = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get User Document from Protected Request
    const user: UserDocument = req.user;

    const query = [
      user,
      process.env.ADMIN_ID
    ]
    query.push(user);

    // Searching for an Exercise by Id
    if (req.query.id) {
      const exercise = await Exercise.find({
        user: {$in: query},
        _id: req.query.id,
      }).sort({name: 1});

      // No exercise is returned
      if (!exercise.length) {
        throw new ErrorResponse("No exercise found", 404)
      }
      // Respond with the exercise found
      res.status(200).json({success: true, data: exercise[0]});
    }
    // Searching for all Exercises
    else {
      const exercises = await Exercise.find({
        user: {$in: query},
      }).sort({name: 1});
      res.status(200).json({success: true, data: exercises})
    }
  } catch (error) {
    next(error)
  }
};

/**
 * Request controller that handles adding an Exercise Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const addExercise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get data from the request body
    const {name, area, type} = req.body

    // Get User Document from Protected Request
    const user: UserDocument = req.user

    // Create Exercise Document
    const exercise = await Exercise.create({
      name,
      area,
      type,
      user,
      isAdmin: user._id === process.env.ADMIN_ID,
    });

    // Respond with success and the created Exercise Document
    res.status(201).json({success: true, data: exercise});
  } catch (error) {
    next(error);
  }
};

/**
 * Request controller that handles finding and deleting an Exercise Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
export const deleteExercise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get ExerciseId from query
    const exerciseId = req.query.id

    // Get User Document from Protected Request
    const user: UserDocument = req.user

    // Query for the Exercise Document of the ExerciseId provided
    const exercise: ExerciseDocument = await Exercise
      .findById(exerciseId)
      .populate("user") as any;

    // If the User associated to the Exercise is the same as the requesting User
    if (exercise.user._id.toString() === user._id) {
      exercise.deleteOne();
    }

    // Respond with success and a success message
    res.status(200).json({success: true, data: "Success"});
  } catch (error) {
    console.error(`Unable to delete exercise: ${error}`);
    next(error);
  }
};
