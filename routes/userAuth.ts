import express from "express";
import {
    forgotpassword,
    login,
    register,
    resetpassword,
} from "../controllers/auth";

const router = express.Router();

// Application startup routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotpassword);
router.route("/resetpassword/:resetToken").put(resetpassword);

export default router;
