import express from "express";
import { addSet, deleteSet } from "../controllers/sets.ts";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/sets/:setId").delete(protect, deleteSet);
router.route("/sets").post(protect, addSet);

export default router;
