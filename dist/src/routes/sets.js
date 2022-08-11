"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sets_1 = require("../controllers/sets");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route("/sets/:setId").delete(auth_1.protect, sets_1.deleteSet);
router.route("/sets").post(auth_1.protect, sets_1.addSet);
exports.default = router;
