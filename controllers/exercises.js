import jwt from "jsonwebtoken";

import Exercise from "../models/Exercise.js";
import User from "../models/User.js";

export const getExercises = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  // Query list to set
  var query = [];

  if (req.query.type === "all") {
    query.push(process.env.ADMIN_ID);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    query.push(decoded.id);

    if (req.query.id) {
      const exercise = await Exercise.find({
        user: decoded.id,
        _id: req.query.id,
      });
      res.status(200).json({ success: true, data: exercise });
    } else {
      const exercises = await Exercise.find({
        user: { $in: query },
      });
      res.status(200).json({ success: true, data: exercises });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addExercise = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const { name, area, muscles, type, goalPerSet, goalPerWorkout } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    const exercise = await Exercise.create({
      name,
      area,
      muscles,
      type,
      goalPerSet,
      goalPerWorkout,
      user,
    });

    res
      .status(201)
      .json({ success: true, data: "Exercise added successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
