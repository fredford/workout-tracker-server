import express from "express";
import {
  getExerciseData,
  getDashboardData,
  getDashboardActivity,
  getTopExercises,
  getRepsByArea,
} from "../controllers/stats";

import { protect } from "../middleware/auth";

const router = express.Router();

router.route("/stats/exerciseData/:exerciseId").get(protect, getExerciseData);
router.route("/stats/dashboardData").get(protect, getDashboardData);
router.route("/stats/dashboardActivity").get(protect, getDashboardActivity);
router.route("/stats/topExercises").get(protect, getTopExercises);
router.route("/stats/repsByArea").get(protect, getRepsByArea);

export default router;
