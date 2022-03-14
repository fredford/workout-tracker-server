import jwt from "jsonwebtoken";

import Workout from "../models/Workout.js";
import User from "../models/User.js";

export const getWorkouts = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  var query = [];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    query.push(decoded.id);

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
    } else {
      const workouts = await Workout.find({
        user: decoded.id,
      }).sort({ date: 1 });

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

  console.log(req.body);

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
