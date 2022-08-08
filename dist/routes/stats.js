"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stats_js_1 = require("../controllers/stats.js");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route("/stats/exerciseData/:exerciseId").get(auth_1.protect, stats_js_1.getExerciseData);
router.route("/stats/dashboardData").get(auth_1.protect, stats_js_1.getDashboardData);
router.route("/stats/dashboardActivity").get(auth_1.protect, stats_js_1.getDashboardActivity);
router.route("/stats/topExercises").get(auth_1.protect, stats_js_1.getTopExercises);
exports.default = router;
