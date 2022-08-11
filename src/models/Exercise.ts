// Library imports
import mongoose, { Types } from "mongoose";
// Mongoose Models
import SetModel from "./Set";

export type ExerciseDocument = mongoose.Document & {
  _id: Types.ObjectId; // Exercise idenfication
  name: string; // Exercise name eg. "Push-ups"
  area: string; // Exercise area eg. "Upper
  type: string; // Exercise type eg. "Repetitions",
  user: Types.ObjectId; // Exercise user ObjectId
  isAdmin: boolean; // Exercise created by admin

  removeOne: (this: ExerciseDocument) => void;
};

// Model Schema for Exercises
const ExerciseSchema = new mongoose.Schema<ExerciseDocument>({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: [true, "Please provide if set by an Admin"],
  },
});
// Upon Exercise deletion remove all Sets associated to that Exercise
ExerciseSchema.methods.removeOne = async function (this: ExerciseDocument) {
  SetModel.deleteMany({ exercise: { _id: this._id } })
    .then((result) => {
      console.log(result);
    })
    .catch((error: Promise<void>) => {
      console.log(error);
    });
  this.deleteOne();
};

const Exercise = mongoose.model<ExerciseDocument>("Exercise", ExerciseSchema);

export default Exercise;
