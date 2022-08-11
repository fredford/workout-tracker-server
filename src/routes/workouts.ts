import express from "express";

import { protect } from "../middleware/auth";

const router = express.Router();

import { getAllDocuments, postDocument } from "../middleware/basicAPI";

router
  .route("/workouts")
  .get(protect, getAllDocuments)
  .post(protect, postDocument);

export default router;
