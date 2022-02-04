import express from "express";
import ExercisesController from "./exercises.controller.js";

const router = express.Router();

router.route("/").get((req, res) => res.send("hello world"));

router.route("/workouts").get((req, res) => res.send("workouts"));

router
  .route("/exercises")
  .get(ExercisesController.apiGetExercises)
  .post(ExercisesController.apiPostExercise)
  .put(ExercisesController.apiUpdateExercise)
  .delete(ExercisesController.apiDeleteExercise);

export default router;
