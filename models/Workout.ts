import mongoose, { Types } from "mongoose";
import Set from "./Set";

export type WorkoutDocument = mongoose.Document & {
  _id: Types.ObjectId;
  date: Date;
  type: string;
  user: Types.ObjectId;
}

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
WorkoutSchema.pre("deleteOne", function (this: WorkoutDocument, next) {

  Set.deleteMany({ workout: { _id: this._id } })
    .then()
    .catch( (error: Promise<void>) => {
      console.log(error);
    });

  next();
});

const Workout = mongoose.model("Workout", WorkoutSchema);

export default Workout;
