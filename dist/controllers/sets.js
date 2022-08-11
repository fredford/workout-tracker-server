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
exports.getSets = exports.addSet = void 0;
// Models
const Exercise_1 = __importDefault(require("../models/Exercise"));
const Set_1 = __importDefault(require("../models/Set"));
const Workout_1 = __importDefault(require("../models/Workout"));
// Utilities
const utils_1 = require("../utils/utils");
const ErrorHandler_1 = __importDefault(require("../middleware/ErrorHandler"));
/**
 * Request controller that handles adding a Set Document
 * @param {Request} req Object for the HTTP request received
 * @param {Response} res Object for the HTTP response to be sent
 * @param {NextFunction} next Control passing
 */
const addSet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the User Document from the request token
        const user = yield (0, utils_1.getUserFromReq)(req);
        // Get the request body information
        const { date, exerciseId, workoutId, amount } = req.body;
        // Check the request body
        ErrorHandler_1.default.checkVariables({ date, exerciseId, workoutId, amount }, "PleaseProvide");
        // Query for the provided Exercise and Workout
        const exercise = yield Exercise_1.default.findById(exerciseId);
        const workout = yield Workout_1.default.findById(workoutId);
        // Check that results are found
        ErrorHandler_1.default.checkVariables({ exercise }, "NotFound");
        ErrorHandler_1.default.checkVariables({ workout }, "NotFound");
        // Check that the results are valid
        ErrorHandler_1.default.checkValidQuery(exercise, exerciseId);
        ErrorHandler_1.default.checkValidQuery(workout, workoutId);
        // Create the Set with Mongoose
        const set = yield Set_1.default.create({
            date,
            exercise,
            workout,
            amount,
            user,
        });
        // Respond with the Set created and 201 status
        res.status(201).json({ success: true, data: set });
    }
    catch (error) {
        next(error);
    }
});
exports.addSet = addSet;
const getSets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the Sets for the workout
        const user = req.user;
        // Set the workout ID from query
        const workoutId = req.query.id;
        // Check that the workout ID is a valid ObjectId
        ErrorHandler_1.default.checkQueryId(["ID", workoutId]);
        // Query for the Workout passed
        const workout = yield Workout_1.default.findById(workoutId);
        // Check that the workout exists
        ErrorHandler_1.default.checkVariables({ workout }, "NotFound");
        // Check that the workout was correctly returned
        ErrorHandler_1.default.checkValidQuery(workout, workoutId);
        // Query database for workout ID related Set Documents
        const results = yield Set_1.default.find({
            user: user._id,
            workout: workoutId,
        })
            .populate("workout")
            .populate("exercise");
        res.status(200).json({ success: true, data: results });
    }
    catch (error) {
        if (!error.statusCode)
            console.log(`Get Sets ${error.message}`);
        next(error);
    }
});
exports.getSets = getSets;
//# sourceMappingURL=sets.js.map