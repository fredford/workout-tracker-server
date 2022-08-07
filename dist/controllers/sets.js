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
const Exercise_js_1 = __importDefault(require("../models/Exercise.ts"));
const errorResponse_1 = require("../utils/errorResponse");
const Set_js_1 = __importDefault(require("../models/Set.js"));
const Workout_js_1 = __importDefault(require("../models/Workout.js"));
const utils_1 = require("../utils/utils");
const addSet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the User Document from the request token
        const user = yield (0, utils_1.getUserFromReq)(req);
        // Get the request body information
        const { date, exerciseId, workoutId, amount } = req.body;
        // Query for the provided Exercise and Workout
        const exercise = yield Exercise_js_1.default.findById(exerciseId);
        const workout = yield Workout_js_1.default.findById(workoutId);
        /* Check if an Exercise or Workout were received */
        if (!exercise || !workout) {
            next(new errorResponse_1.ErrorResponse("Exercise or workout do not exist!", 404));
        }
        /* Create the Set with Mongoose */
        const set = yield Set_js_1.default.create({
            date,
            exercise,
            workout,
            amount,
            user,
        });
        /* Respond with the Set created and 201 status */
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
        /* Get the User Document from the request token */
        const user = yield (0, utils_1.getUserFromReq)(req);
        const set = yield Set_js_1.default.findById(setId);
        if (!set) {
            next(new errorResponse_1.ErrorResponse("Set does not exist!", 400));
        }
        const response = yield Set_js_1.default.deleteOne({
            _id: set.id,
        });
        res.status(200).json({ success: true, data: response });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.deleteSet = deleteSet;
