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
exports.deleteSet = exports.addSet = void 0;
// Models
const Exercise_1 = __importDefault(require("../models/Exercise"));
const Set_1 = __importDefault(require("../models/Set"));
const Workout_1 = __importDefault(require("../models/Workout"));
// Utilities
const errorResponse_1 = require("../utils/errorResponse");
const utils_1 = require("../utils/utils");
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
        // Query for the provided Exercise and Workout
        const exercise = yield Exercise_1.default.findById(exerciseId);
        const workout = yield Workout_1.default.findById(workoutId);
        // Check if an Exercise or Workout were received
        if (!exercise || !workout) {
            next(new errorResponse_1.ErrorResponse("Exercise or workout do not exist!", 404));
        }
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
const deleteSet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { setId } = req.params;
    try {
        // Get the User Document from the request token
        const user = yield (0, utils_1.getUserFromReq)(req);
        const set = yield Set_1.default.findById(setId);
        if (!set) {
            next(new errorResponse_1.ErrorResponse("Set does not exist!", 400));
        }
        // Delete Set Document if it exists
        const response = set === null || set === void 0 ? void 0 : set.deleteOne();
        res.status(200).json({ success: true, data: response });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.deleteSet = deleteSet;
