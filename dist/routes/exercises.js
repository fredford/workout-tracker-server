"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const basicAPI_1 = require("../middleware/basicAPI");
const router = express_1.default.Router();
router
    .route("/exercises")
    .get(auth_1.protect, basicAPI_1.getAllDocuments)
    .post(auth_1.protect, basicAPI_1.postDocument);
router
    .route("/exercise")
    .get(auth_1.protect, basicAPI_1.getDocumentById)
    .delete(auth_1.protect, basicAPI_1.deleteDocument);
exports.default = router;
//# sourceMappingURL=exercises.js.map