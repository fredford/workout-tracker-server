import express from "express";
import {
  addExercise,
  getExercises,
  deleteExercise,
} from "../controllers/exercises.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/exercises")
  .get(protect, getExercises)
  .post(protect, addExercise)
  .delete(protect, deleteExercise);

export default router;
