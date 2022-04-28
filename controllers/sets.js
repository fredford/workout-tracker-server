import jwt from "jsonwebtoken";
import Exercise from "../models/Exercise.js";

import Set from "../models/Set.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";

export const getSets = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const { workoutId } = req.params;

  var query = [];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    query.push(decoded.id);

    const sets = await Set.find({
      user: { $in: query },
      workout: workoutId,
    })
      .populate("workout")
      .populate("exercise")
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: sets });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addSet = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const { workoutId } = req.params;
  const { date, exerciseId, amount } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = await User.findById(decoded.id);

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
    });

    res.status(201).json({ success: true, data: set });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
