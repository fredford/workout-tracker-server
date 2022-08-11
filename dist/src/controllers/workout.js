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
exports.deleteWorkout = exports.getWorkout = void 0;
const Set_1 = __importDefault(require("../models/Set"));
const Workout_1 = __importDefault(require("../models/Workout"));
const getWorkout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { workoutId } = req.params;
    const query = [];
    try {
        const user = req.user;
        query.push(user._id);
        const sets = yield Set_1.default.find({
            user: { $in: query },
            workout: workoutId,
        })
            .populate("workout")
            .populate("exercise");
        res.status(200).json({ success: true, data: sets });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getWorkout = getWorkout;
const deleteWorkout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { workoutId } = req.params;
    try {
        const user = req.user;
        const workout = yield Workout_1.default.findById(workoutId);
        workout.deleteOne();
        const response = {};
        res.status(200).json({ success: true, data: response });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.deleteWorkout = deleteWorkout;
