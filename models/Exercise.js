import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please provide a name"],
  },
  area: {
    type: String,
    required: [true, "Please provide a body area"],
  },
  muscles: {
    type: String,
    required: [true, "Please provide a muscle group"],
  },
  type: {
    type: String,
    required: [true, "Please provide the workout quantifier type"],
    enum: ["Repetitions", "Duration"],
  },
  goalPerSet: {
    type: Number,
    required: [true, "Please provide the goal per set"],
  },
  goalPerWorkout: {
    type: Number,
    required: [true, "Please provide the goal per workout"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

export default Exercise;
