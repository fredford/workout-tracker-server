"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const basicAPI_1 = require("../middleware/basicAPI");
const workout_1 = require("../controllers/workout");
router
    .route("/workouts")
    .get(auth_1.protect, basicAPI_1.getAllDocuments)
    .post(auth_1.protect, basicAPI_1.postDocument);
router
    .route("/workout")
    .get(auth_1.protect, basicAPI_1.getDocumentById)
    .delete(auth_1.protect, basicAPI_1.deleteDocument);
router.route("/lastworkout").get(auth_1.protect, workout_1.lastWorkout);
exports.default = router;
//# sourceMappingURL=workouts.js.map