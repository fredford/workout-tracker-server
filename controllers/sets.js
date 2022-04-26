import jwt from "jsonwebtoken";
import Exercise from "../models/Exercise.js";

import Set from "../models/Set.js";
import User from "../models/User.js";

export const getSets = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const { id } = req.query;

  console.log(id);

  var query = [];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    query.push(decoded.id);

    const sets = await Set.find({
      user: { $in: query },
      workout: id,
    }).sort({ date: -1 });

    res.status(200).json({ success: true, data: sets });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const addSet = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const { date, exerciseId, amount } = req.body;

  var query = [];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = await User.findById(decoded.id);

    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      new Error("Exercise does not match any existing exercises!");
    }

    const set = await Set.create({
      date,
      exerciseId,
      amount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
