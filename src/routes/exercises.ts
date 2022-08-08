import express from "express";
import {
  addExercise,
  getExercises,
  deleteExercise,
} from "../controllers/exercises";

import {protect} from "../middleware/auth";

const router = express.Router();

router
  .route("/exercises")
  .get(protect, getExercises)
  .post(protect, addExercise)
  .delete(protect, deleteExercise);

export default router;
