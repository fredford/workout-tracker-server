"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
WorkoutSchema.methods.removeOne = function () {
    return __awaiter(this, void 0, void 0, function* () {
        Set_1.default.deleteMany({ workout: { _id: this._id } })
            .then((result) => {
            console.log(result);
        })
            .catch((error) => {
            console.log(error);
        });
        this.deleteOne();
    });
};
// WorkoutSchema.pre("deleteOne", function (this: WorkoutDocument, next) {
//   SetModel.deleteMany({ workout: { _id: this._id } })
//     .then((result) => {
//       console.log(result);
//     })
//     .catch((error: Promise<void>) => {
//       console.log(error);
//     });
//   next();
// });
const Workout = mongoose_1.default.model("Workout", WorkoutSchema);
exports.default = Workout;
//# sourceMappingURL=Workout.js.map