import express from "express";
import { getExerciseData } from "../controllers/stats.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/stats/exerciseData/:exerciseId").get(protect, getExerciseData);

export default router;
