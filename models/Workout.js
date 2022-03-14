import mongoose from "mongoose";

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

const Workout = mongoose.model("Workout", WorkoutSchema);

export default Workout;
