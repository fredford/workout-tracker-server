import express from "express";
import { user, updateUser, deleteUser } from "../controllers/user.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router
  .route("/profile")
  .get(protect, user)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

export default router;
