import jwt from "jsonwebtoken";

import Set from "../models/Set.js";

export const getExerciseData = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const { exerciseId } = req.params;

  var query = [];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    query.push(decoded.id);

    const sets = await Set.find({
      user: { $in: query },
      exercise: exerciseId,
    })
      .populate("workout")
      .populate("exercise");

    var output = {
      stats: {},
      cumulative: {},
      workoutProgression: {},
      setProgression: {},
    };

    var total = sets
      .map((set) => Number(set.amount))
      .reduce((prev, next) => prev + next);

    output.stats.Total = total;
    output.stats.Average = (
      Math.round((total / sets.length) * 100) / 100
    ).toFixed(2);
    output.stats.Max = Math.max(...sets.map((set) => Number(set.amount)));

    var resultArr = [];
    var dateArr = [];

    var cumulativeSum = 0;
    var setCounter = 1;

    for (const set of sets) {
      var date = new Date(set.date)
        .toISOString()
        .replace(/T/, " ")
        .split(" ")[0];
      var index = dateArr.indexOf(date);

      var amount = Number(set.amount);

      if (index == -1) {
        dateArr.push(date);
        output.workoutProgression[date] = amount;

        // Summing the cumulative total repetitions
        cumulativeSum += amount;

        // Setting the current cumulative total on the new date
        output.cumulative[date] = cumulativeSum;

        // Set Progression Counter
        setCounter = 1;
      } else {
        // Summing the repetitions done on this date
        output.workoutProgression[date] += amount;

        // Summing the repetitions amount on each date
        cumulativeSum += amount;

        // Updating the current cumulative total on the date
        output.cumulative[date] += amount;

        // Set Progression Counter
        setCounter += 1;
      }

      // Setting the current Set Count with the amount done
      output.setProgression[`${date} Set ${setCounter}`] = amount;
    }

    res.status(200).json({ success: true, data: output });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const tempData = {
  stats: {
    Total: 100,
    Avg: 20,
    Max: 25,
  },
  cumulative: {
    "2022-6-21": 40,
    "2022-6-22": 60,
    "2022-6-24": 90,
  },
  workoutProgression: {
    "2022-6-21": 40,
    "2022-6-22": 20,
    "2022-6-24": 30,
  },
  setProgression: {
    "2022-6-21 Set 1": 15,
    "2022-6-21 Set 2": 25,
    "2022-6-22 Set 1": 20,
    "2022-6-22 Set 2": 30,
    "2022-6-24 Set 1": 20,
    "2022-6-24 Set 2": 35,
  },
};
