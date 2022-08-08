"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workout_js_1 = require("../controllers/workout.js");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router
    .route("/workout/:workoutId")
    .get(auth_1.protect, workout_js_1.getWorkout)
    .delete(auth_1.protect, workout_js_1.deleteWorkout);
exports.default = router;
