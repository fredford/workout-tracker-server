import jwt from "jsonwebtoken";

import Set from "../models/Set.js";

export const getWorkout = async (req, res, next) => {
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
      .populate("exercise");

    res.status(200).json({ success: true, data: sets });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
