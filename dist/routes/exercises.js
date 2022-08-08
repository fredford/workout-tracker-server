"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
const express_1 = __importDefault(require("express"));
const exercises_js_1 = require("../controllers/exercises.ts");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router
  .route("/exercises")
  .get(auth_1.protect, exercises_js_1.getExercises)
  .post(auth_1.protect, exercises_js_1.addExercise)
  .delete(auth_1.protect, exercises_js_1.deleteExercise);
exports.default = router;
