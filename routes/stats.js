import express from "express";
import {
  getExerciseData,
  getDashboardData,
  getDashboardActivity,
} from "../controllers/stats.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/stats/exerciseData/:exerciseId").get(protect, getExerciseData);
router.route("/stats/dashboardData").get(protect, getDashboardData);
router.route("/stats/dashboardActivity").get(protect, getDashboardActivity);

export default router;
