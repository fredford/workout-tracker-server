import mongoose, { Types } from "mongoose";
import SetModel from "./Set";

export type WorkoutDocument = mongoose.Document & {
  _id: Types.ObjectId; // Workout indentification
  date: Date; // Date the workout was created
  type: string; // Workout type eg. "Maintenance",
  user: Types.ObjectId; // Workout user ObjectId
  removeOne: () => void; //
};

const WorkoutSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: () => Date.now(),
  },
  type: {
    type: String,
    required: [true, "Please provide a type of workout"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

/**
 * Middleware executed when deleteOne operation is called to clean up Sets
 */
WorkoutSchema.methods.removeOne = async function (this: WorkoutDocument) {
  SetModel.deleteMany({ workout: { _id: this._id } })
    .then((result) => {
      console.log(result);
    })
    .catch((error: Promise<void>) => {
      console.log(error);
    });
  this.deleteOne();
};

const Workout = mongoose.model("Workout", WorkoutSchema);

export default Workout;
