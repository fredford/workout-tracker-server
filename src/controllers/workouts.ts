import jwt from "jsonwebtoken";

import Workout from "../models/Workout";
import {UserDocument} from "../models/User";
import Set from "../models/Set";
import {ErrorResponse} from "../utils/errorResponse"
import {NextFunction, Request, Response} from "express";

export const getWorkouts = async (req: Request, res: Response, next: NextFunction) => {


  const query = [];

  try {
    const user: UserDocument = req.user

    query.push(user._id);

    // Query Parameter for ID is passed, using getById
    if (req.query.id) {
      const workout = await Workout.find({
        user: user._id,
        _id: req.query.id,
      });

      if (workout.length === 0) {
        return next(new ErrorResponse("Workout not found", 404));
      }
      res.status(200).json({success: true, data: workout[0]});
    }
    // Query Parameter for Last is passed, using getLast. Looking for the most recent workout
    else if (req.query.last) {
      // Query the database for the latest workout performed by the user
      const workout = await Workout.find({user: user._id})
        .sort({date: -1})
        .limit(1);

      // Check that a workout is returned
      if (workout.length === 0) {
        return next(new ErrorResponse("No workouts found", 404));
      }

      // Get the list of sets for this workout
      const sets = await Set.find({workout: workout[0]._id});
      // Compute the number of sets performed
      const setsCount = sets.length;
      // Calculate the total number of repetitions performed
      const totalReps = sets.reduce((sum, curr) => sum + Number(curr.amount), 0);
      // Return the data object
      res.status(200).json({
        success: true,
        data: {
          id: workout[0]._id,
          type: workout[0].type,
          sets: setsCount,
          totalRepetitions: totalReps,
        },
      });
    } else {
      const workouts = await Workout.find({
        user: user._id,
      }).sort({date: -1});

      res.status(200).json({success: true, data: workouts});
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addWorkout = async (req: Request, res: Response, next: NextFunction) => {

  const {date, type} = req.body;

  try {

    const user: UserDocument = req.user

    const workout = await Workout.create({
      date,
      type,
    });

    res.status(201).json({success: true, data: workout});
  } catch (error) {
    console.log(error);
    next(error);
  }
};
