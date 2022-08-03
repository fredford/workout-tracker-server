import jwt from "jsonwebtoken";
import Exercise from "../models/Exercise.js";

import Set from "../models/Set.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";

export const addSet = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const { date, exerciseId, workoutId, amount } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    const exercise = await Exercise.findById(exerciseId);
    const workout = await Workout.findById(workoutId);

    if (!exercise || !workout) {
      new Error("Exercise or workout do not exist!");
    }

    const set = await Set.create({
      date,
      exercise,
      workout,
      amount,
      user,
    });

    res.status(201).json({ success: true, data: set });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteSet = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const { setId } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = await User.findById(decoded.id);

    const set = await Set.findById(setId);

    if (!set) {
      new Error("Set does not exist!");
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
