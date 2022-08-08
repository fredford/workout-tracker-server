import jwt from "jsonwebtoken";

import Exercise from "../models/Exercise";
import {User} from "../models/User";
import {ErrorResponse} from "../utils/errorResponse"

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

    var exercise;

    if (req.query.id) {
      exercise = await Exercise.find({
        user: decoded.id,
        _id: req.query.id,
      }).sort({name: 1});

      if (exercise.length === 0) {
        exercise = await Exercise.find({
          user: process.env.ADMIN_ID,
          _id: req.query.id,
        }).sort({name: 1});
      } else {
        new ErrorResponse("No exercise found", 404);
      }

      res.status(200).json({success: true, data: exercise[0]});
    } else {
      const exercises = await Exercise.find({
        user: {$in: query},
      }).sort({name: 1});
      res.status(200).json({success: true, data: exercises});
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addExercise = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const {name, area, type, user} = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = await User.findById(decoded.id);

    if (userId !== user) {
      new Error("User ID does not match the auth token provided");
    }

    const exercise = await Exercise.create({
      name,
      area,
      type,
      user,
      isAdmin: user === process.env.ADMIN_ID ? true : false,
    });

    res.status(201).json({success: true, data: exercise});
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteExercise = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const exerciseId = req.query.id;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const exercise = await Exercise.findById(exerciseId).populate("user");

    if (exercise.user._id.toString() === decoded.id) {
      exercise.deleteOne();
    }

    res.status(200).json({success: true, data: "Success"});
  } catch (error) {
    console.error(`Unable to delete exercise: ${error}`);
    next(error);
  }
};
