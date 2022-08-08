import jwt from "jsonwebtoken";

import Set from "../models/Set";
import Workout from "../models/Workout";
import {NextFunction, Request, Response} from "express";
import {UserDocument} from "../models/User";

export const getWorkout = async (req: Request, res: Response, next: NextFunction) => {


  const {workoutId} = req.params;

  const query = [];

  try {
    const user: UserDocument = req.user

    query.push(user._id);

    const sets = await Set.find({
      user: {$in: query},
      workout: workoutId,
    })
      .populate("workout")
      .populate("exercise");

    res.status(200).json({success: true, data: sets});
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteWorkout = async (req: Request, res: Response, next: NextFunction) => {


  const {workoutId} = req.params;

  try {
    const user: UserDocument = req.user

    const workout = await Workout.findById(workoutId);

    workout.deleteOne();

    const response = {};

    res.status(200).json({success: true, data: response});
  } catch (error) {
    console.log(error);
    next(error);
  }
};
