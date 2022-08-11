import express from "express";
import { lastWorkout } from "../controllers/workout";
import { getDocumentById, deleteDocument } from "../middleware/basicAPI";

import { protect } from "../middleware/auth";

const router = express.Router();

router
  .route("/workout")
  .get(protect, getDocumentById)
  .delete(protect, deleteDocument);

router.route("/lastworkout").get(protect, lastWorkout);

export default router;
