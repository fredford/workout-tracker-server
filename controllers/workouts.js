import jwt from "jsonwebtoken";

import Workout from "../models/Workout.js";
import User from "../models/User.js";
import Set from "../models/Set.js";

export const getWorkouts = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  var query = [];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    query.push(decoded.id);

    // Query Parameter for ID is passed, using getById
    if (req.query.id) {
      const workout = await Workout.find({
        user: decoded.id,
        _id: req.query.id,
      });

      if (workout.length === 0) {
        res
          .status(404)
          .json({ success: false, data: "Workout does not exist" });
        next(error);
      }
      res.status(200).json({ success: true, data: workout });
    }
    // Query Parameter for Last is passed, using getLast. Looking for the most recent workout
    else if (req.query.last) {
      // Query the database for the latest workout performed by the user
      const workout = await Workout.find({ user: decoded.id })
        .sort({ date: -1 })
        .limit(1);

      // Check that a workout is returned
      if (workout.length === 0) {
        res.stats(404).json({ success: false, data: "Workout does not exist" });
        next(error);
      }

      // Get the list of sets for this workout
      const sets = await Set.find({ workout: workout[0]._id });
      // Compute the number of sets performed
      let setsCount = sets.length;
      // Calculate the total number of repetitions performed
      let totalReps = sets.reduce((sum, curr) => sum + Number(curr.amount), 0);
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
        user: decoded.id,
      }).sort({ date: -1 });

      res.status(200).json({ success: true, data: workouts });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addWorkout = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const { date, type, user } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = await User.findById(decoded.id);

    if (userId !== user) {
      new Error("User ID does not match the auth token provided");
    }

    const workout = await Workout.create({
      date,
      type,
      user,
    });

    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
