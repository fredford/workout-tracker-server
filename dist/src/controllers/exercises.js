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
exports.deleteExercise = exports.addExercise = exports.getExercises = void 0;
const Exercise_1 = __importDefault(require("../models/Exercise"));
const errorResponse_1 = require("../utils/errorResponse");
/**
 * Request controller that handles finding and returning Exercise Documents.
 * If 'id' is used as a query parameter with an ExerciseId then a specific
 * Exercise Document will be found, otherwise all User and Admin exercises
 * will be returned.
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
const getExercises = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get User Document from Protected Request
        const user = req.user;
        const query = [
            user,
            process.env.ADMIN_ID
        ];
        query.push(user);
        // Searching for an Exercise by Id
        if (req.query.id) {
            const exercise = yield Exercise_1.default.find({
                user: { $in: query },
                _id: req.query.id,
            }).sort({ name: 1 });
            // No exercise is returned
            if (!exercise.length) {
                throw new errorResponse_1.ErrorResponse("No exercise found", 404);
            }
            // Respond with the exercise found
            res.status(200).json({ success: true, data: exercise[0] });
        }
        // Searching for all Exercises
        else {
            const exercises = yield Exercise_1.default.find({
                user: { $in: query },
            }).sort({ name: 1 });
            res.status(200).json({ success: true, data: exercises });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getExercises = getExercises;
/**
 * Request controller that handles adding an Exercise Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
const addExercise = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get data from the request body
        const { name, area, type } = req.body;
        // Get User Document from Protected Request
        const user = req.user;
        // Create Exercise Document
        const exercise = yield Exercise_1.default.create({
            name,
            area,
            type,
            user,
            isAdmin: user._id === process.env.ADMIN_ID,
        });
        // Respond with success and the created Exercise Document
        res.status(201).json({ success: true, data: exercise });
    }
    catch (error) {
        next(error);
    }
});
exports.addExercise = addExercise;
/**
 * Request controller that handles finding and deleting an Exercise Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
const deleteExercise = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get ExerciseId from query
        const exerciseId = req.query.id;
        // Get User Document from Protected Request
        const user = req.user;
        // Query for the Exercise Document of the ExerciseId provided
        const exercise = yield Exercise_1.default
            .findById(exerciseId)
            .populate("user");
        // If the User associated to the Exercise is the same as the requesting User
        if (exercise.user._id.toString() === user._id) {
            exercise.deleteOne();
        }
        // Respond with success and a success message
        res.status(200).json({ success: true, data: "Success" });
    }
    catch (error) {
        console.error(`Unable to delete exercise: ${error}`);
        next(error);
    }
});
exports.deleteExercise = deleteExercise;
