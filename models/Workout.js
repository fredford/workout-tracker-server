import mongoose from "mongoose";
import Set from "./Set.js";

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

WorkoutSchema.pre("deleteOne", { document: true }, function (next) {
  Set.deleteMany({ workout: { _id: this._id } })
    .then(function () {})
    .catch(function (error) {
      console.log(error);
    });

  next();
});

const Workout = mongoose.model("Workout", WorkoutSchema);

export default Workout;
