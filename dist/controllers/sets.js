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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Exercise_js_1 = __importDefault(require("../models/Exercise.js"));
const errorResponse_1 = require("../utils/errorResponse");
const Set_js_1 = __importDefault(require("../models/Set.js"));
const User_1 = __importDefault(require("../models/User"));
const Workout_js_1 = __importDefault(require("../models/Workout.js"));
const addSet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization.split(" ")) !== null && _a !== void 0 ? _a : {};
        const { date, exerciseId, workoutId, amount } = req.body;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield User_1.default.findById(decoded.id);
        const exercise = yield Exercise_js_1.default.findById(exerciseId);
        const workout = yield Workout_js_1.default.findById(workoutId);
        if (!exercise || !workout) {
            next(new errorResponse_1.ErrorResponse("Exercise or workout do not exist!", 404));
        }
        const set = yield Set_js_1.default.create({
            date,
            exercise,
            workout,
            amount,
            user,
        });
        res.status(201).json({ success: true, data: set });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.addSet = addSet;
const deleteSet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization.split(" ")[1];
    const { setId } = req.params;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userId = yield User_1.default.findById(decoded.id);
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
