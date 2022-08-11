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
// Library imports
const mongoose_1 = __importDefault(require("mongoose"));
// Mongoose Models
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
ExerciseSchema.methods.removeOne = function () {
    return __awaiter(this, void 0, void 0, function* () {
        Set_1.default.deleteMany({ exercise: { _id: this._id } })
            .then((result) => {
            console.log(result);
        })
            .catch((error) => {
            console.log(error);
        });
        this.deleteOne();
    });
};
// ExerciseSchema.pre("deleteOne", async function (this: ExerciseDocument, next) {
//   SetModel.deleteMany({ exercise: { _id: this._id } })
//     .then((result) => {
//       console.log("success");
//     })
//     .catch((error: Promise<void>) => {
//       console.log(error);
//     });
//   next();
// });
const Exercise = mongoose_1.default.model("Exercise", ExerciseSchema);
exports.default = Exercise;
//# sourceMappingURL=Exercise.js.map