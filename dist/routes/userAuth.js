"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
const express_1 = __importDefault(require("express"));
const auth_js_1 = require("../controllers/auth.ts");
const router = express_1.default.Router();
// Application startup routes
router.route("/register").post(auth_js_1.register);
router.route("/login").post(auth_js_1.login);
router.route("/forgotpassword").post(auth_js_1.forgotpassword);
router.route("/resetpassword/:resetToken").put(auth_js_1.resetpassword);
exports.default = router;
