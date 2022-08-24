// Library imports
import { NextFunction, Request, Response } from "express";
// Mongoose Models
import SetModel from "../models/Set";
import { UserDocument } from "../models/User";
// Utilities
import errorHandler from "../middleware/ErrorHandler";

interface IOutput {
  stats: { [key: string]: any };
  cumulative: { [key: string]: any };
  workoutProgression: { [key: string]: any };
  setProgression: { [key: string]: any };
}

export const getExerciseData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the User Document from the Request
    const user: UserDocument = req.user;
    // Get the ExerciseId from request parameters
    const { exerciseId } = req.params;
    // Check if a valid ObjectID is provided
    errorHandler.checkQueryId(["ID", exerciseId]);
    // Query for Set Documents with the ExerciseId provided by the User
    const sets = await SetModel.find({
      user: user._id,
      exercise: exerciseId,
    })
      .populate("workout")
      .populate("exercise");

    // Check if any Sets were found
    errorHandler.checkVariables({ sets }, "NotFound");

    // Initialize the Output object
    const output: IOutput = {
      stats: {},
      cumulative: {},
      workoutProgression: {},
      setProgression: {},
    };

    // Compute the total number of Reps performed in the Sets
    const total = sets.map((set) => Number(set.amount)).reduce((prev, curr) => prev + curr);

    /* Assign Stats object information
     * Total - total number of repetitions performed
     * Average - average number of repetitions performed
     * Max - maximum number of repetitions performed */
    output.stats.Total = total;
    output.stats.Average = (Math.round((total / sets.length) * 100) / 100).toFixed(2);
    output.stats.Max = Math.max(...sets.map((set) => Number(set.amount)));

    // Initialize date array
    const dateArr = [];
    // Initialize cumulative sum of repetitions performed
    let cumulativeSum = 0;
    // Initialize set counter
    let setCounter = 1;

    // Iterate through each Set Document
    for (const set of sets) {
      // Format the stored Date
      const date = new Date(set.date).toISOString().replace(/T/, " ").split(" ")[0];

      // Check for the index of the date if it already exists in the date array
      const index = dateArr.indexOf(date);

      // Convert the Amount to a number
      const amount = Number(set.amount);

      // If the date does not exist in the date array, add it
      if (index === -1) {
        // Add date to the date array
        dateArr.push(date);
        // Add the first set amount to the WorkoutProgression for the date
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
  } catch (error: any) {
    if (!error.statusCode) console.log(`Get Exercise Data Stats - ${error.message}`);
    next(error);
  }
};

export const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the User Document from the Request
    const user: UserDocument = req.user;

    // Get all user sets
    const sets = await SetModel.find({
      user: user._id,
    })
      .populate("workout")
      .populate("exercise");

    // Check if any Sets were found
    errorHandler.checkVariables({ sets }, "NotFound");

    // Compute total sets
    const completedSets = {
      title: "Sets",
      subtitle: "Completed",
      data: sets.length,
    };

    // Compute total reps

    const totalReps = sets.reduce((acc, set) => acc + Number(set.amount), 0);

    const totalRepetitions = {
      title: "Total",
      subtitle: "Repetitions",
      data: totalReps,
    };

    // Compute total workouts
    const uniqueWorkouts = [...new Set(sets.map((set) => set.workout._id.toString()))];

    const completedWorkouts = {
      title: "Workouts",
      subtitle: "Completed",
      data: uniqueWorkouts.length,
    };

    // Compute Top Exercise
    const distinctExercises = sets.reduce((acc: any, set: any) => {
      acc[set.exercise.name] = acc[set.exercise.name]
        ? (acc[set.exercise.name] += Number(set.amount))
        : Number(set.amount);
      return acc;
    }, {});

    const maxExercise = Object.keys(distinctExercises).reduce((a, b) =>
      distinctExercises[a] > distinctExercises[b] ? a : b
    );

    const topExercise = {
      title: "Top Exercise",
      subtitle: maxExercise,
      data: distinctExercises[maxExercise],
    };

    // Compute Highest Average
    const distinctSets = sets.reduce((acc: any, set: any) => {
      acc[set.exercise.name] = acc[set.exercise.name] ? (acc[set.exercise.name] += 1) : 1;
      return acc;
    }, {});

    let currMax = 0.0;
    let currName = "";

    const maxAverage = Object.keys(distinctExercises).map((a) => {
      const average = distinctExercises[a] / distinctSets[a];

      currName = average > currMax ? a : currName;
      currMax = average > currMax ? average : currMax;
    });

    const topAverage = {
      title: "Top Average",
      subtitle: currName,
      data: currMax.toFixed(1),
    };

    // Exercise Data
    const distinctAreas = sets.reduce((acc: any, set: any) => {
      acc[set.exercise.area] = acc[set.exercise.area]
        ? (acc[set.exercise.area] += Number(set.amount))
        : Number(set.amount);
      return acc;
    }, {});

    const maxArea = Object.keys(distinctAreas).reduce((a, b) =>
      distinctAreas[a] > distinctAreas[b] ? a : b
    );

    const topArea = {
      title: "Top Area",
      subtitle: maxArea,
      data: distinctAreas[maxArea],
    };

    const date21Days = new Date();
    const date14Days = new Date();

    date21Days.setDate(date21Days.getDate() - 21);
    date14Days.setDate(date14Days.getDate() - 14);

    // Check last week to this week
    const repsPrevWeek = sets.reduce((acc: any, set: any) => {
      if (set.date > date21Days && set.date < date14Days) {
        acc[set.exercise.area] = acc[set.exercise.area]
          ? (acc[set.exercise.area] += Number(set.amount))
          : Number(set.amount);
      }
      return acc;
    }, {});

    const repsCurrWeek = sets.reduce((acc: any, set: any) => {
      if (set.date > date14Days) {
        acc[set.exercise.area] = acc[set.exercise.area]
          ? (acc[set.exercise.area] += Number(set.amount))
          : Number(set.amount);
      }
      return acc;
    }, {});

    let maxAreaDiff = 0;
    let maxAreaName = "Next Week";

    Object.keys(repsCurrWeek).map((a) => {
      const percentDiff = ((repsCurrWeek[a] - repsPrevWeek[a]) / repsPrevWeek[a]) * 100;

      maxAreaName = percentDiff > maxAreaDiff ? a : maxAreaName;
      maxAreaDiff = percentDiff > maxAreaDiff ? percentDiff : maxAreaDiff;
    });

    const topProgressArea = {
      title: "Top Progress Wkly",
      subtitle: maxAreaName,
      data: `+${maxAreaDiff.toFixed()}%`,
    };

    // Best Workout
    const repsByWorkout = sets.reduce((acc: any, set: any) => {
      const workoutId = set.workout._id.toString();

      acc[workoutId] = acc[workoutId] ? (acc[workoutId] += Number(set.amount)) : Number(set.amount);

      return acc;
    }, {});

    const maxWorkout = Object.keys(repsByWorkout).reduce((a, b) =>
      repsByWorkout[a] > repsByWorkout[b] ? a : b
    );

    const bestWorkout = {
      title: "Best Workout",
      subtitle: "Repetitions",
      data: repsByWorkout[maxWorkout],
    };

    const output = {
      basic: [totalRepetitions, topAverage, completedSets, completedWorkouts],
      area: [topArea, topProgressArea, bestWorkout, topExercise],
    };

    res.status(200).json({ success: true, data: output });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getDashboardActivity = async (req: Request, res: Response, next: NextFunction) => {
  const { range } = req.query;

  try {
    // Get the User Document from the request token
    const user: UserDocument = req.user;
    // Check that Range is included in the request
    errorHandler.checkVariables({ range }, "PleaseProvide");
    // Initialize the current date
    const currDate = new Date();
    // Initialize the date range
    const startDate = new Date(
      new Date().setDate(currDate.getDate() - dateRange[range as keyof typeof dateRange])
    );

    // Get all user sets
    const sets = await SetModel.find({
      user: user._id,
      date: {
        $gt: startDate,
        $lt: currDate,
      },
    })
      .populate("workout")
      .populate("exercise");
    // Check that results are returned
    errorHandler.checkVariables({ sets }, "NotFound");

    // Compute the Repetitions for each date
    const repsByDate = sets.reduce((acc: any, set: any) => {
      const date = set.workout.date.toISOString().split("T")[0];
      acc[date] = acc[date] ? (acc[date] += Number(set.amount)) : Number(set.amount);
      return acc;
    }, {});

    const tempDate = new Date(Object.keys(repsByDate)[0]);

    // Output initialization
    const output: { [k: string]: any } = {};

    do {
      const shortDate = tempDate.toISOString().split("T")[0];

      output[shortDate] = repsByDate[shortDate] ? repsByDate[shortDate] : 0;
      tempDate.setDate(tempDate.getDate() + 1);
    } while (tempDate < currDate);

    res.status(200).json({ success: true, data: output });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getTopExercises = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Request query for body area and date range
    const { area, range, num } = req.query;
    // Get User Document from Request
    const user: UserDocument = req.user;
    // Check that Area and Range are provided
    errorHandler.checkVariables({ area, range, num }, "PleaseProvide");
    // Get Current Date
    const currDate = new Date();
    // Get the Start Date using the range specified in query
    const startDate = new Date(
      new Date().setDate(currDate.getDate() - dateRange[range as keyof typeof dateRange])
    );

    // Get all user sets
    const sets = await SetModel.find({
      user: user._id,
      date: {
        $gt: startDate,
        $lt: currDate,
      },
    })
      .populate("workout")
      .populate("exercise");

    // Check that results are returned
    errorHandler.checkVariables({ sets }, "NotFound");

    const strArea = area as string;
    const upperCaseArea = strArea.charAt(0).toUpperCase() + strArea.slice(1);

    const checkArea = strArea === "all" ? ["Upper", "Lower", "Core", "Cardio"] : [upperCaseArea];

    const exerciseStats = sets.reduce((acc: any, set: any) => {
      if (!checkArea.includes(set.exercise.area)) {
        return acc;
      }

      const amount = Number(set.amount);

      if (acc[set.exercise.name]) {
        acc[set.exercise.name].Sets += 1;
        acc[set.exercise.name].Reps = acc[set.exercise.name].Reps + amount;
        acc[set.exercise.name].avgReps = (
          acc[set.exercise.name].Reps / acc[set.exercise.name].Sets
        ).toFixed(1);

        if (amount > acc[set.exercise.name].Max) {
          acc[set.exercise.name].Max = amount;
        }
      } else {
        acc[set.exercise.name] = {
          Sets: 1,
          Reps: amount,
          Avg: amount,
          area: set.exercise.area,
          Max: amount,
          exerciseId: set.exercise._id.toString(),
          name: set.exercise.name,
        };
      }
      return acc;
    }, {});

    let output = Object.values(exerciseStats).sort((a: any, b: any) => b.Reps - a.Reps);
    if (num !== "all") {
      output = output.slice(0, Number(num) ?? 5);
    }

    res.status(200).json({ success: true, data: output });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getRepsByArea = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: UserDocument = req.user;
    // Get all user sets
    const sets: any = await SetModel.find({
      user: user._id,
    })
      .populate("workout")
      .populate("exercise");

    // Check that results are returned
    errorHandler.checkVariables({ sets }, "NotFound");

    // Output initialization
    const output: { [k: string]: any } = {};
    output.Upper = 0;
    output.Lower = 0;
    output.Core = 0;
    output.Cardio = 0;

    for (const set of sets) {
      // console.log(set.exercise?.area);
      output[set.exercise.area] += Number(set.amount);
    }

    res.status(200).json({ success: true, data: output });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

const dateRange = {
  week: 7,
  month: 30,
  year: 365,
  alltime: 10000,
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
