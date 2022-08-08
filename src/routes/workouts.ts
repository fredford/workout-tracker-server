import express from "express";
import {addWorkout, getWorkouts} from "../controllers/workouts";

import {protect} from "../middleware/auth";

const router = express.Router();

router.route("/workouts").get(protect, getWorkouts).post(protect, addWorkout);

export default router;
