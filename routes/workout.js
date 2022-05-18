import express from "express";
import { deleteWorkout, getWorkout } from "../controllers/workout.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/workout/:workoutId")
  .get(protect, getWorkout)
  .delete(protect, deleteWorkout);

export default router;