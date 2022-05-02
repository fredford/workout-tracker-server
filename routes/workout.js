import express from "express";
import { getWorkout } from "../controllers/workout.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/workout/:workoutId").get(protect, getWorkout);

export default router;
