import express from "express";

import { protect } from "../middleware/auth";

const router = express.Router();

import {
  getAllDocuments,
  postDocument,
  getDocumentById,
  deleteDocument,
} from "../middleware/basicAPI";

import { lastWorkout } from "../controllers/workout";
import { getAllWorkouts } from "../controllers/workouts";

router.route("/workouts").get(protect, getAllWorkouts).post(protect, postDocument);

router.route("/workout").get(protect, getDocumentById).delete(protect, deleteDocument);

router.route("/lastworkout").get(protect, lastWorkout);

export default router;
