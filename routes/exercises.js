import express from "express";
import { addExercise, getExercises } from "../controllers/exercises.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/exercises")
  .get(protect, getExercises)
  .post(protect, addExercise);

export default router;
