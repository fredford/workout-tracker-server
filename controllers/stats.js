import jwt from "jsonwebtoken";

import SetModel from "../models/Set.js";

export const getExerciseData = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const { exerciseId } = req.params;

  var query = [];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    query.push(decoded.id);

    const sets = await SetModel.find({
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

export const getDashboardData = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  var query = [];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    query.push(decoded.id);

    // Get all user sets
    const sets = await SetModel.find({
      user: decoded.id,
    })
      .populate("workout")
      .populate("exercise");

    // Compute total sets
    let completedSets = {
      title: "Sets",
      subtitle: "Completed",
      data: sets.length,
    };

    // Compute total reps

    const totalReps = sets.reduce((acc, set) => acc + Number(set.amount), 0);

    let totalRepetitions = {
      title: "Total",
      subtitle: "Repetitions",
      data: totalReps,
    };

    // Compute total workouts
    const uniqueWorkouts = [
      ...new Set(sets.map((set) => set.workout._id.toString())),
    ];

    let completedWorkouts = {
      title: "Workouts",
      subtitle: "Completed",
      data: uniqueWorkouts.length,
    };

    // Compute Top Exercise
    const distinctExercises = sets.reduce((acc, set) => {
      acc[set.exercise.name] = acc[set.exercise.name]
        ? (acc[set.exercise.name] += Number(set.amount))
        : Number(set.amount);
      return acc;
    }, {});

    const maxExercise = Object.keys(distinctExercises).reduce((a, b) =>
      distinctExercises[a] > distinctExercises[b] ? a : b
    );

    let topExercise = {
      title: "Top Exercise",
      subtitle: maxExercise,
      data: distinctExercises[maxExercise],
    };

    // Compute Highest Average
    const distinctSets = sets.reduce((acc, set) => {
      acc[set.exercise.name] = acc[set.exercise.name]
        ? (acc[set.exercise.name] += 1)
        : 1;
      return acc;
    }, {});

    var currMax = 0.0;
    var currName = "";

    const maxAverage = Object.keys(distinctExercises).map((a) => {
      let average = distinctExercises[a] / distinctSets[a];

      currName = average > currMax ? a : currName;
      currMax = average > currMax ? average : currMax;
    });

    let topAverage = {
      title: "Top Average",
      subtitle: currName,
      data: currMax.toFixed(1),
    };

    // Exercise Data
    const distinctAreas = sets.reduce((acc, set) => {
      acc[set.exercise.area] = acc[set.exercise.area]
        ? (acc[set.exercise.area] += Number(set.amount))
        : Number(set.amount);
      return acc;
    }, {});

    const maxArea = Object.keys(distinctAreas).reduce((a, b) =>
      distinctAreas[a] > distinctAreas[b] ? a : b
    );

    let topArea = {
      title: "Top Area",
      subtitle: maxArea,
      data: distinctAreas[maxArea],
    };

    var date21Days = new Date();
    var date14Days = new Date();
    var dateCurrent = new Date();

    date21Days.setDate(date21Days.getDate() - 21);
    date14Days.setDate(date14Days.getDate() - 14);

    // Check last week to this week
    const repsPrevWeek = sets.reduce((acc, set) => {
      if (set.date > date21Days && set.date < date14Days) {
        acc[set.exercise.area] = acc[set.exercise.area]
          ? (acc[set.exercise.area] += Number(set.amount))
          : Number(set.amount);
      }
      return acc;
    }, {});

    const repsCurrWeek = sets.reduce((acc, set) => {
      if (set.date > date14Days) {
        acc[set.exercise.area] = acc[set.exercise.area]
          ? (acc[set.exercise.area] += Number(set.amount))
          : Number(set.amount);
      }
      return acc;
    }, {});

    var maxAreaDiff = 0;
    var maxAreaName = "Next Week";

    Object.keys(repsCurrWeek).map((a) => {
      let percentDiff =
        ((repsCurrWeek[a] - repsPrevWeek[a]) / repsPrevWeek[a]) * 100;

      maxAreaName = percentDiff > maxAreaDiff ? a : maxAreaName;
      maxAreaDiff = percentDiff > maxAreaDiff ? percentDiff : maxAreaDiff;
    });

    let topProgressArea = {
      title: "Top Progress Wkly",
      subtitle: maxAreaName,
      data: `+${maxAreaDiff.toFixed()}%`,
    };

    // Best Workout
    const repsByWorkout = sets.reduce((acc, set) => {
      let workoutId = set.workout._id.toString();

      acc[workoutId] = acc[workoutId]
        ? (acc[workoutId] += Number(set.amount))
        : Number(set.amount);

      return acc;
    }, {});

    const maxWorkout = Object.keys(repsByWorkout).reduce((a, b) =>
      repsByWorkout[a] > repsByWorkout[b] ? a : b
    );

    let bestWorkout = {
      title: "Best Workout",
      subtitle: "Repetitions",
      data: repsByWorkout[maxWorkout],
    };

    let output = {
      basic: [totalRepetitions, topAverage, completedSets, completedWorkouts],
      area: [topArea, topProgressArea, bestWorkout, topExercise],
    };

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
