"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Set_1 = __importDefault(require("./Set"));
const WorkoutSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        default: () => Date.now(),
    },
    type: {
        type: String,
        required: [true, "Please provide a type of workout"],
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
/**
 * Middleware executed when deleteOne operation is called to clean up Sets
 */
WorkoutSchema.pre("deleteOne", function (next) {
    Set_1.default.deleteMany({ workout: { _id: this._id } })
        .then()
        .catch((error) => {
        console.log(error);
    });
    next();
});
const Workout = mongoose_1.default.model("Workout", WorkoutSchema);
exports.default = Workout;
//# sourceMappingURL=Workout.js.map