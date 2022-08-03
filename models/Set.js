import mongoose from "mongoose";

const SetSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: () => Date.now(),
  },
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workout",
    required: true,
  },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Set = mongoose.model("Set", SetSchema);

export default Set;
