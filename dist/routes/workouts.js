"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workouts_js_1 = require("../controllers/workouts.js");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route("/workouts").get(auth_1.protect, workouts_js_1.getWorkouts).post(auth_1.protect, workouts_js_1.addWorkout);
exports.default = router;
