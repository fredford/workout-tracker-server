import express from "express";
import { addSet, getSets } from "../controllers/sets.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/sets").get(protect, getSets).post(protect, addSet);

export default router;
