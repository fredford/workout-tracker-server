import express from "express";
import ExercisesController from "./exercises.controller.js";

const router = express.Router();

router.route("/").get(ExercisesController.apiGetExercises);

export default router;
