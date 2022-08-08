import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/user";

import { protect } from "../middleware/auth";

const router = express.Router();

router
  .route("/profile")
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser);

export default router;
