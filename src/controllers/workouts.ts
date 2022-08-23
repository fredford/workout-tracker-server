import mongoose from "mongoose";

// Library imports
import { Request, Response, NextFunction } from "express";

// Model imports
import { UserDocument } from "../models/User";
import Workout, { WorkoutDocument } from "../models/Workout";
import SetModel, { SetDocument } from "../models/Set";

interface WorkoutResult {
  _id: mongoose.Types.ObjectId;
  type: string;
  user: mongoose.Types.ObjectId;
  date: Date;
  Reps: number;
  Sets: number;
  Avg: string;
}

interface WorkoutResults extends Array<WorkoutResult> {}

export const getAllWorkouts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the User Document from the Protected Request
    const user: UserDocument = req.user;
    // Get the User ID's to query for
    const query = [user, process.env.ADMIN_ID];
    // Perform the query and return a list of Documents
    const workouts: WorkoutDocument[] = await Workout.find({
      user: { $in: query },
    }).sort({ date: -1 });

    const results: WorkoutResults = [];

    for (const workout of workouts) {
      const sets: SetDocument[] = await SetModel.find({
        workout: { _id: workout._id },
      });

      const totalReps = sets.reduce((acc: any, obj) => {
        return acc + Number(obj.amount);
      }, 0);

      const avgReps = (totalReps / sets.length).toFixed(1);

      results.push({
        _id: workout._id,
        type: workout.type,
        user: workout.user,
        date: workout.date,
        Reps: totalReps,
        Sets: sets.length,
        Avg: avgReps,
      });
    }

    // Respond with the workouts from the query
    res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    if (!error.statusCode) console.log(`GET all -  Workouts ${error}`);
    next(error);
  }
};
