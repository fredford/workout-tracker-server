import express from "express";
import { deleteDocument, getAllDocuments, postDocument } from "../middleware/basicAPI";

import { protect } from "../middleware/auth";

const router = express.Router();

router
  .route("/weight")
  .get(protect, getAllDocuments)
  .post(protect, postDocument)
  .delete(protect, deleteDocument);

export default router;
