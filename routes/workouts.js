import express from "express";
import { addWorkout, getWorkouts } from "../controllers/workouts.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/workouts").get(protect, getWorkouts).post(protect, addWorkout);

export default router;
