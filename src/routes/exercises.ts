import express from "express";
import {
  addExercise,
  getExercises,
  deleteExercise,
} from "../controllers/exercises";

import { protect } from "../middleware/auth";

import {
  getAllDocuments,
  getDocumentById,
  postDocument,
  deleteDocument,
} from "../middleware/basicAPI";

const router = express.Router();

router
  .route("/exercises")
  .get(protect, getAllDocuments)
  .post(protect, postDocument);

router
  .route("/exercise")
  .get(protect, getDocumentById)
  .delete(protect, deleteDocument);

export default router;
