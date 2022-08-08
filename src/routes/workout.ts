import express from "express";
import {deleteWorkout, getWorkout} from "../controllers/workout";

import {protect} from "../middleware/auth";

const router = express.Router();

router
  .route("/workout/:workoutId")
  .get(protect, getWorkout)
  .delete(protect, deleteWorkout);

export default router;
