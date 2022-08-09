"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Set_1 = __importDefault(require("./Set"));
// Model Schema for Exercises
const ExerciseSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    area: {
        type: String,
        required: [true, "Please provide a body area"],
    },
    type: {
        type: String,
        required: [true, "Please provide the workout quantifier type"],
        enum: ["Repetitions", "Duration"],
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: [true, "Please provide if set by an Admin"],
    },
});
// Upon Exercise deletion remove all Sets associated to that Exercise
ExerciseSchema.pre("deleteOne", function (next) {
    Set_1.default.deleteMany({ exercise: { _id: this._id } })
        .then()
        .catch((error) => {
        console.log(error);
    });
    next();
});
const Exercise = mongoose_1.default.model("Exercise", ExerciseSchema);
exports.default = Exercise;
//# sourceMappingURL=Exercise.js.map