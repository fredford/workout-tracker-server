"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Library imports
const mongoose_1 = __importDefault(require("mongoose"));
// Model Schema for Sets
const SetSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        default: () => Date.now(),
    },
    workout: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Workout",
        required: true,
    },
    exercise: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Exercise",
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
const Set = mongoose_1.default.model("Set", SetSchema);
exports.default = Set;
//# sourceMappingURL=Set.js.map