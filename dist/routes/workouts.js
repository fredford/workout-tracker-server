"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const basicAPI_1 = require("../middleware/basicAPI");
router
    .route("/workouts")
    .get(auth_1.protect, basicAPI_1.getAllDocuments)
    .post(auth_1.protect, basicAPI_1.postDocument);
exports.default = router;
//# sourceMappingURL=workouts.js.map