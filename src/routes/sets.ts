import express from "express";
import { deleteDocument } from "../middleware/basicAPI";
import { addSet, getSets } from "../controllers/sets";

import { protect } from "../middleware/auth";

const router = express.Router();

router
  .route("/sets")
  .get(protect, getSets)
  .post(protect, addSet)
  .delete(protect, deleteDocument);

export default router;
