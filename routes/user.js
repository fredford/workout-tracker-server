import express from "express";
import { user } from "../controllers/user.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/profile").get(protect, user);

export default router;
