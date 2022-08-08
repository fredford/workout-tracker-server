"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWorkout = exports.getWorkouts = void 0;
const Workout_1 = __importDefault(require("../models/Workout"));
const Set_1 = __importDefault(require("../models/Set"));
const errorResponse_1 = require("../utils/errorResponse");
const getWorkouts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = [];
    try {
        const user = req.user;
        query.push(user._id);
        // Query Parameter for ID is passed, using getById
        if (req.query.id) {
            const workout = yield Workout_1.default.find({
                user: user._id,
                _id: req.query.id,
            });
            if (workout.length === 0) {
                return next(new errorResponse_1.ErrorResponse("Workout not found", 404));
            }
            res.status(200).json({ success: true, data: workout[0] });
        }
        // Query Parameter for Last is passed, using getLast. Looking for the most recent workout
        else if (req.query.last) {
            // Query the database for the latest workout performed by the user
            const workout = yield Workout_1.default.find({ user: user._id })
                .sort({ date: -1 })
                .limit(1);
            // Check that a workout is returned
            if (workout.length === 0) {
                return next(new errorResponse_1.ErrorResponse("No workouts found", 404));
            }
            // Get the list of sets for this workout
            const sets = yield Set_1.default.find({ workout: workout[0]._id });
            // Compute the number of sets performed
            const setsCount = sets.length;
            // Calculate the total number of repetitions performed
            const totalReps = sets.reduce((sum, curr) => sum + Number(curr.amount), 0);
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
        }
        else {
            const workouts = yield Workout_1.default.find({
                user: user._id,
            }).sort({ date: -1 });
            res.status(200).json({ success: true, data: workouts });
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getWorkouts = getWorkouts;
const addWorkout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, type } = req.body;
    try {
        const user = req.user;
        const workout = yield Workout_1.default.create({
            date,
            type,
        });
        res.status(201).json({ success: true, data: workout });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.addWorkout = addWorkout;
