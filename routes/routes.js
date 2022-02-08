import express from "express";
import {
  forgotpassword,
  login,
  register,
  resetpassword,
} from "../controllers/auth.js";
//import ExercisesController from "./exercises.controller.js";

const router = express.Router();

router.route("/").get((req, res) => res.send("hello world"));

//router.route("/workouts").get((req, res) => res.send("workouts"));

//router
//  .route("/exercises")
// .get(ExercisesController.apiGetExercises)
//  .post(ExercisesController.apiPostExercise)
//  .put(ExercisesController.apiUpdateExercise)
//  .delete(ExercisesController.apiDeleteExercise);

// Application startup routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotpassword);
router.route("/resetpassword/:resetToken").put(resetpassword);

export default router;
